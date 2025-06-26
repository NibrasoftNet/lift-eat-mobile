import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  MealOrmProps,
  DailyProgressOrmProps,
  DailyMealProgressOrmProps,
} from '@/db/schema';
import useProgressStore, {
  MealWithProgress,
} from '@/utils/store/progressStore';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { Box } from '../ui/box';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

// Extension du type MealWithProgress pour inclure dailyPlanMealId
interface MealWithProgressExtended extends MealWithProgress {
  dailyPlanMealId?: number;
}

interface MealsClickSelectionProps {
  selectedDate: string;
  dailyProgress: DailyProgressOrmProps;
  mealsWithProgress: MealWithProgress[];
  onMealStatusChange: () => void;
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

type Item = {
  id: number;
  name: string;
  type: string;
  mealType: MealType;
  carbs: number;
  protein: number;
  fat: number;
  progress?: DailyMealProgressOrmProps | null;
  dailyPlanMealId?: number;
};

type MealList = {
  breakfast: Item[];
  lunch: Item[];
  dinner: Item[];
  snacks: Item[];
};

const mealTypes: (keyof MealList)[] = [
  'breakfast',
  'lunch',
  'dinner',
  'snacks',
];

const { width } = Dimensions.get('window');
const LIST_WIDTH = width / 2 - 10;

const MealItem = ({
  item,
  isSelected,
  onSelect,
}: {
  item: Item;
  isSelected: boolean;
  onSelect: (item: Item) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(item)}
      style={[styles.item, isSelected && styles.selectedItem]}
    >
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.mealTypeText}>{item.type}</Text>
      <Text style={styles.nutritionText}>
        C: {item.carbs}g P: {item.protein}g L: {item.fat}g
      </Text>
    </TouchableOpacity>
  );
};

const TargetArea = ({
  title,
  onSelect,
  isSelectionMode,
  isEmpty = false,
}: {
  title: string;
  onSelect: () => void;
  isSelectionMode: boolean;
  isEmpty?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[styles.targetArea, isSelectionMode && styles.activeTargetArea]}
      disabled={!isSelectionMode}
    >
      <Text style={styles.targetAreaText}>
        {isEmpty ? 'Aucun repas' : isSelectionMode ? 'Déplacer ici' : title}
      </Text>
    </TouchableOpacity>
  );
};

const MealsClickSelection: React.FC<MealsClickSelectionProps> = ({
  selectedDate,
  dailyProgress,
  mealsWithProgress,
  onMealStatusChange,
}) => {
  const drizzleDb = useDrizzleDb();
  const { setMealsWithProgress } = useProgressStore();

  // Initialize empty lists
  const initialLeftList: MealList = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };

  const initialRightList: MealList = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };

  const [leftList, setLeftList] = useState<MealList>(initialLeftList);
  const [rightList, setRightList] = useState<MealList>(initialRightList);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectionMode, setSelectionMode] = useState<boolean>(false);

  // Déterminer le type de repas
  const determineMealType = (type: string | null): MealType => {
    if (!type) return 'snacks';

    const lowerType = type.toLowerCase();

    if (lowerType.includes('breakfast')) return 'breakfast';
    if (lowerType.includes('lunch')) return 'lunch';
    if (lowerType.includes('dinner')) return 'dinner';

    return 'snacks';
  };

  // Populate lists on component mount
  useEffect(() => {
    console.log(
      'MealsClickSelection - Initialisation avec',
      mealsWithProgress.length,
      'repas',
    );

    const available: MealList = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    };

    const consumed: MealList = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    };

    mealsWithProgress.forEach((meal) => {
      const mealType = determineMealType(meal.type);
      const mealItem: Item = {
        id: meal.id,
        name: meal.name,
        type: meal.type || '',
        mealType: mealType,
        carbs: meal.carbs || 0,
        protein: meal.protein || 0,
        fat: meal.fat || 0,
        progress: meal.progress,
        dailyPlanMealId: (meal as MealWithProgressExtended).dailyPlanMealId,
      };

      if (meal.progress && meal.progress.consomme) {
        consumed[mealType].push(mealItem);
      } else {
        available[mealType].push(mealItem);
      }
    });

    setLeftList(available);
    setRightList(consumed);
    setMealsWithProgress(mealsWithProgress);
  }, [mealsWithProgress, setMealsWithProgress]);

  // Gérer la sélection d'un repas
  const handleItemSelect = (item: Item) => {
    // Si l'item est déjà sélectionné, on annule la sélection
    if (selectedItem && selectedItem.id === item.id) {
      setSelectedItem(null);
      setSelectionMode(false);
      return;
    }

    setSelectedItem(item);
    setSelectionMode(true);
  };

  // Gérer le déplacement d'un repas
  const handleMoveItem = async (toConsumed: boolean, toMealType: MealType) => {
    if (!selectedItem || !selectionMode) {
      return;
    }

    try {
      // Déterminer si le repas est déjà consommé
      const isCurrentlyConsumed = Object.values(rightList).some((items) =>
        items.some((item) => item.id === selectedItem.id),
      );

      // Si l'état ne change pas, on annule l'opération
      if (isCurrentlyConsumed === toConsumed) {
        setSelectedItem(null);
        setSelectionMode(false);
        return;
      }

      if (!dailyProgress) {
        throw new Error('Données de progression quotidienne manquantes');
      }

      if (!selectedItem.dailyPlanMealId) {
        throw new Error('Identifiant de repas quotidien manquant');
      }

      // Appeler directement le MCP Server pour marquer le repas comme consommé ou non
      logger.info(
        LogCategory.DATABASE,
        'Marquage du repas comme consommé via MCP Server',
        {
          dailyProgressId: dailyProgress.id,
          mealId: selectedItem.id,
          dailyPlanMealId: selectedItem.dailyPlanMealId,
          consumed: toConsumed,
        },
      );

      const result = await sqliteMCPServer.markMealAsConsumedViaMCP(
        dailyProgress.id,
        selectedItem.id,
        selectedItem.dailyPlanMealId,
        toConsumed,
      );

      if (!result.success) {
        logger.error(
          LogCategory.DATABASE,
          `Échec du marquage du repas: ${result.error}`,
        );
        throw new Error(result.error || 'Erreur lors du marquage du repas');
      }

      // Mettre à jour les listes localement
      if (toConsumed) {
        // Supprimer de la liste des repas à consommer
        setLeftList((prev) => {
          const newList = { ...prev };
          for (const mealType of mealTypes) {
            newList[mealType] = newList[mealType].filter(
              (item) => item.id !== selectedItem.id,
            );
          }
          return newList;
        });

        // Ajouter à la liste des repas consommés
        setRightList((prev) => {
          const newList = { ...prev };
          const updatedItem = {
            ...selectedItem,
            progress: {
              ...selectedItem.progress,
              consomme: true,
              pourcentageConsomme: 100,
              dailyProgressId: dailyProgress.id,
              mealId: selectedItem.id,
              dailyPlanMealId: selectedItem.dailyPlanMealId,
            } as DailyMealProgressOrmProps,
            mealType: toMealType, // Ajout de la propriété mealType requise par le type Item
          };

          // Nous devons convertir le type d'enum de repas en clé MealList
          const mealKey = selectedItem.type.toLowerCase() as MealType;
          if (mealTypes.includes(mealKey)) {
            newList[mealKey] = [...newList[mealKey], updatedItem];
          }

          return newList;
        });
      } else {
        // Supprimer de la liste des repas consommés
        setRightList((prev) => {
          const newList = { ...prev };
          for (const mealType of mealTypes) {
            newList[mealType] = newList[mealType].filter(
              (item) => item.id !== selectedItem.id,
            );
          }
          return newList;
        });

        // Ajouter à la liste des repas à consommer
        setLeftList((prev) => {
          const newList = { ...prev };
          const updatedItem = {
            ...selectedItem,
            progress: {
              ...selectedItem.progress,
              consomme: false,
              pourcentageConsomme: 0,
              dailyProgressId: dailyProgress.id,
              mealId: selectedItem.id,
              dailyPlanMealId: selectedItem.dailyPlanMealId,
            } as DailyMealProgressOrmProps,
            mealType: toMealType, // Ajout de la propriété mealType requise par le type Item
          };

          // Nous devons convertir le type d'enum de repas en clé MealList
          const mealKey = selectedItem.type.toLowerCase() as MealType;
          if (mealTypes.includes(mealKey)) {
            newList[mealKey] = [...newList[mealKey], updatedItem];
          }

          return newList;
        });
      }

      // Notifier le composant parent pour rafraîchir les données
      onMealStatusChange();
    } catch (error: any) {
      console.error(error);
    } finally {
      // Réinitialiser l'état de sélection
      setSelectedItem(null);
      setSelectionMode(false);
    }
  };

  const handleMealAction = async (
    selectedItem: MealWithProgressExtended,
    toConsumed: boolean,
  ) => {
    if (!dailyProgress) {
      return;
    }

    try {
      if (!selectedItem.dailyPlanMealId) {
        throw new Error('Identifiant de repas quotidien manquant');
      }

      // Appeler directement le MCP Server pour marquer le repas comme consommé ou non
      logger.info(
        LogCategory.DATABASE,
        'Marquage du repas comme consommé via MCP Server',
        {
          dailyProgressId: dailyProgress.id,
          mealId: selectedItem.id,
          dailyPlanMealId: selectedItem.dailyPlanMealId,
          consumed: toConsumed,
        },
      );

      const result = await sqliteMCPServer.markMealAsConsumedViaMCP(
        dailyProgress.id,
        selectedItem.id,
        selectedItem.dailyPlanMealId,
        toConsumed,
      );

      if (!result.success) {
        logger.error(
          LogCategory.DATABASE,
          `Échec du marquage du repas: ${result.error}`,
        );
        throw new Error(result.error || 'Erreur lors du marquage du repas');
      }

      // Mettre à jour les listes localement
      if (toConsumed) {
        // Supprimer de la liste des repas à consommer
        setLeftList((prev) => {
          const newList = { ...prev };
          for (const mealType of mealTypes) {
            newList[mealType] = newList[mealType].filter(
              (item) => item.id !== selectedItem.id,
            );
          }
          return newList;
        });

        // Ajouter à la liste des repas consommés
        setRightList((prev) => {
          const newList = { ...prev };
          const updatedItem = {
            ...selectedItem,
            progress: {
              ...selectedItem.progress,
              consomme: true,
              pourcentageConsomme: 100,
              dailyProgressId: dailyProgress.id,
              mealId: selectedItem.id,
              dailyPlanMealId: selectedItem.dailyPlanMealId,
            } as DailyMealProgressOrmProps,
            mealType: selectedItem.type.toLowerCase() as MealType, // Ajout de la propriété mealType requise par le type Item
          };

          // Nous devons convertir le type d'enum de repas en clé MealList
          const mealKey = selectedItem.type.toLowerCase() as MealType;
          if (mealTypes.includes(mealKey)) {
            newList[mealKey] = [...newList[mealKey], updatedItem];
          }

          return newList;
        });
      } else {
        // Supprimer de la liste des repas consommés
        setRightList((prev) => {
          const newList = { ...prev };
          for (const mealType of mealTypes) {
            newList[mealType] = newList[mealType].filter(
              (item) => item.id !== selectedItem.id,
            );
          }
          return newList;
        });

        // Ajouter à la liste des repas à consommer
        setLeftList((prev) => {
          const newList = { ...prev };
          const updatedItem = {
            ...selectedItem,
            progress: {
              ...selectedItem.progress,
              consomme: false,
              pourcentageConsomme: 0,
              dailyProgressId: dailyProgress.id,
              mealId: selectedItem.id,
              dailyPlanMealId: selectedItem.dailyPlanMealId,
            } as DailyMealProgressOrmProps,
            mealType: selectedItem.type.toLowerCase() as MealType, // Ajout de la propriété mealType requise par le type Item
          };

          // Nous devons convertir le type d'enum de repas en clé MealList
          const mealKey = selectedItem.type.toLowerCase() as MealType;
          if (mealTypes.includes(mealKey)) {
            newList[mealKey] = [...newList[mealKey], updatedItem];
          }

          return newList;
        });
      }

      // Notifier le composant parent pour rafraîchir les données
      onMealStatusChange();
    } catch (error: any) {
      console.error(error);
    }
  };

  // Rendu d'une liste de repas par type
  const renderMealList = (list: MealList, isConsumed: boolean) => {
    return (
      <View style={styles.listColumn}>
        {mealTypes.map((mealType) => (
          <View key={mealType} style={styles.mealTypeContainer}>
            <Text style={styles.mealTypeHeader}>
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </Text>

            {list[mealType].length === 0 ? (
              <TargetArea
                title="Aucun repas"
                onSelect={() => handleMoveItem(isConsumed, mealType)}
                isSelectionMode={selectionMode}
                isEmpty
              />
            ) : (
              <View>
                {list[mealType].map((item) => (
                  <MealItem
                    key={item.id}
                    item={item}
                    isSelected={selectedItem?.id === item.id}
                    onSelect={handleItemSelect}
                  />
                ))}

                {/* Zone cible pour déplacer un repas ici */}
                {selectionMode &&
                  selectedItem &&
                  !list[mealType].some(
                    (item) => item.id === selectedItem.id,
                  ) && (
                    <TargetArea
                      title="Déplacer ici"
                      onSelect={() => handleMoveItem(isConsumed, mealType)}
                      isSelectionMode={selectionMode}
                    />
                  )}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  if (mealsWithProgress.length === 0) {
    return (
      <View style={styles.noMealsContainer}>
        <Text style={styles.noMealsText}>
          Aucun repas disponible pour cette date.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.completionText}>
          {dailyProgress.pourcentageCompletion.toFixed(0)}% complété
        </Text>

        {selectionMode && selectedItem && (
          <Text style={styles.selectionText}>
            Sélectionné: {selectedItem.name}
          </Text>
        )}
      </View>

      <View style={styles.listsContainer}>
        {/* Liste des repas à consommer */}
        <View style={[styles.listColumn, styles.leftList]}>
          <Text style={styles.listTitle}>À consommer</Text>
          <ScrollView style={styles.scrollContainer}>
            {renderMealList(leftList, false)}
          </ScrollView>
        </View>

        {/* Liste des repas consommés */}
        <View style={[styles.listColumn, styles.rightList]}>
          <Text style={styles.listTitle}>Consommés</Text>
          <ScrollView style={styles.scrollContainer}>
            {renderMealList(rightList, true)}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  completionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectionText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#007AFF',
  },
  listsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  listColumn: {
    flex: 1,
    padding: 5,
  },
  leftList: {
    backgroundColor: '#e3f2fd',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  rightList: {
    backgroundColor: '#fff8e1',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  mealTypeContainer: {
    marginBottom: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  mealTypeHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  item: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  selectedItem: {
    backgroundColor: '#c8e1ff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  itemText: {
    fontWeight: 'bold',
  },
  mealTypeText: {
    fontSize: 12,
    color: '#666',
  },
  nutritionText: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
  },
  targetArea: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
  },
  activeTargetArea: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  targetAreaText: {
    color: '#555',
    fontStyle: 'italic',
  },
  noMealsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMealsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  toastText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MealsClickSelection;
