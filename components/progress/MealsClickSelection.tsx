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
import { useToast } from '../ui/toast';
import { Box } from '../ui/box';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { useMarkMealAsConsumed } from '@/utils/hooks';

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
  const toast = useToast();
  const { setMealsWithProgress } = useProgressStore();
  const { mutateAsync: markMeal } = useMarkMealAsConsumed();

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
  // Prend en compte le champ mealType de la relation si disponible, sinon utilise le type par défaut
  const determineMealType = (
    type: string | null,
    mealType?: string | null,
  ): MealType => {
    // Si un type spécifique au plan est fourni, l'utiliser en priorité
    if (mealType) {
      const lowerMealType = mealType.toLowerCase();

      if (lowerMealType.includes('breakfast')) return 'breakfast';
      if (lowerMealType.includes('lunch')) return 'lunch';
      if (lowerMealType.includes('dinner')) return 'dinner';
      if (lowerMealType.includes('snack')) return 'snacks';
    }

    // Sinon utiliser le type par défaut
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
    console.log(
      'MealsClickSelection - Vérification du champ mealType:',
      mealsWithProgress.map((m) => ({
        id: m.id,
        name: m.name,
        type: m.type,
        mealType: m.mealType,
      })),
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

    // Afficher un toast pour guider l'utilisateur
    toast.show({
      placement: 'top',
      render: () => (
        <Box className="bg-blue-600 px-4 py-3 rounded-sm mb-5">
          <Text style={styles.toastText}>
            Sélectionnez maintenant l'emplacement de destination
          </Text>
        </Box>
      ),
    });
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

      // Si l'ID du repas quotidien est manquant, on utilise une valeur de secours
      let dailyPlanMealId = selectedItem.dailyPlanMealId;

      if (!dailyPlanMealId) {
        logger.warn(
          LogCategory.DATABASE,
          "Identifiant de repas quotidien manquant, utilisation de l'ID du repas comme secours",
          {
            mealId: selectedItem.id,
            dailyProgressId: dailyProgress.id,
          },
        );

        // Utiliser l'ID du repas comme valeur de secours
        dailyPlanMealId = selectedItem.id;
        toast.show({
          placement: 'top',
          render: () => (
            <Box className="bg-yellow-600 px-4 py-3 rounded-sm mb-5">
              <Text style={styles.toastText}>
                Association automatique du repas...
              </Text>
            </Box>
          ),
        });
      }

      // Utiliser le service de progression pour marquer le repas comme consommé
      logger.info(
        LogCategory.DATABASE,
        'Marquage du repas comme consommé via progressService',
        {
          dailyProgressId: dailyProgress.id,
          mealId: selectedItem.id,
          dailyPlanMealId: dailyPlanMealId,
          consumed: toConsumed,
        },
      );

      const result = await markMeal({
        dailyProgressId: dailyProgress.id,
        mealId: selectedItem.id,
        dailyPlanMealId: Number(dailyPlanMealId),
        consumed: toConsumed,
      });

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
          // Créer un objet conforme à l'interface Item
          const updatedItem: Item = {
            ...selectedItem,
            progress: {
              ...selectedItem.progress,
              consomme: true,
              pourcentageConsomme: 100,
              // S'assurer que les propriétés obligatoires sont présentes
              createdAt: selectedItem.progress?.createdAt || null,
              updatedAt: selectedItem.progress?.updatedAt || null,
              id: selectedItem.progress?.id || 0,
              dailyProgressId: selectedItem.progress?.dailyProgressId || 0,
              mealId: selectedItem.progress?.mealId || 0,
              dailyPlanMealId: selectedItem.progress?.dailyPlanMealId || 0,
              // Ajouter les propriétés nutritionnelles avec valeurs par défaut
              caloriesEffectives:
                selectedItem.progress?.caloriesEffectives || 0,
              proteinEffectives: selectedItem.progress?.proteinEffectives || 0,
              carbsEffectives: selectedItem.progress?.carbsEffectives || 0,
              fatEffectives: selectedItem.progress?.fatEffectives || 0,
            },
            mealType: toMealType, // Mise à jour du type de repas si nécessaire
          };

          newList[toMealType].push(updatedItem);
          return newList;
        });

        // Afficher un toast de confirmation
        toast.show({
          placement: 'bottom',
          render: () => (
            <Box className="bg-green-600 px-4 py-3 rounded-sm mb-5">
              <Text style={styles.toastText}>
                Repas marqué comme consommé !
              </Text>
            </Box>
          ),
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
          // Créer un objet conforme à l'interface Item
          const updatedItem: Item = {
            ...selectedItem,
            progress: {
              ...selectedItem.progress,
              consomme: false,
              pourcentageConsomme: 0,
              // S'assurer que les propriétés obligatoires sont présentes
              createdAt: selectedItem.progress?.createdAt || null,
              updatedAt: selectedItem.progress?.updatedAt || null,
              id: selectedItem.progress?.id || 0,
              dailyProgressId: selectedItem.progress?.dailyProgressId || 0,
              mealId: selectedItem.progress?.mealId || 0,
              dailyPlanMealId: selectedItem.progress?.dailyPlanMealId || 0,
              // Ajouter les propriétés nutritionnelles avec valeurs par défaut
              caloriesEffectives:
                selectedItem.progress?.caloriesEffectives || 0,
              proteinEffectives: selectedItem.progress?.proteinEffectives || 0,
              carbsEffectives: selectedItem.progress?.carbsEffectives || 0,
              fatEffectives: selectedItem.progress?.fatEffectives || 0,
            },
            mealType: toMealType, // Mise à jour du type de repas si nécessaire
          };

          newList[toMealType].push(updatedItem);
          return newList;
        });

        // Afficher un toast de confirmation
        toast.show({
          placement: 'bottom',
          render: () => (
            <Box className="bg-orange-600 px-4 py-3 rounded-sm mb-5">
              <Text style={styles.toastText}>
                Repas remis dans la liste "à consommer"
              </Text>
            </Box>
          ),
        });
      }

      // Notifier le composant parent
      onMealStatusChange();
    } catch (error) {
      let errorMessage = 'Erreur lors du changement de statut du repas';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      logger.error(
        LogCategory.DATABASE,
        `Erreur lors du déplacement du repas: ${errorMessage}`,
      );

      toast.show({
        placement: 'top',
        render: () => (
          <Box className="bg-red-600 px-4 py-3 rounded-sm mb-5">
            <Text style={styles.toastText}>{errorMessage}</Text>
          </Box>
        ),
      });
    } finally {
      // Réinitialiser l'état de sélection après l'opération
      setSelectedItem(null);
      setSelectionMode(false);
    }
  };

  // Gérer le déplacement d'un repas vers la liste des repas à consommer
  const handleMoveToAvailable = (mealType: MealType) => {
    handleMoveItem(false, mealType);
  };

  // Gérer le déplacement d'un repas vers la liste des repas consommés
  const handleMoveToConsumed = (mealType: MealType) => {
    handleMoveItem(true, mealType);
  };

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.headerContainer}>
        <View style={styles.headerItem}>
          <Text style={styles.headerTitle}>À consommer</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={styles.headerTitle}>Consommés</Text>
        </View>
      </View>

      {/* Conteneur pour les deux colonnes */}
      <View style={styles.listsContainer}>
        {/* Liste des repas à consommer (gauche) */}
        <ScrollView
          style={styles.listScrollContainer}
          contentContainerStyle={styles.listContentContainer}
        >
          {mealTypes.map((mealType) => (
            <View key={`left-${mealType}`} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>
                {mealType === 'breakfast'
                  ? 'Petit déjeuner'
                  : mealType === 'lunch'
                  ? 'Déjeuner'
                  : mealType === 'dinner'
                  ? 'Dîner'
                  : 'Collations'}
              </Text>

              <TargetArea
                title="Ajouter ici"
                onSelect={() => selectedItem && handleMoveToAvailable(mealType)}
                isSelectionMode={selectionMode && selectedItem !== null}
                isEmpty={leftList[mealType].length === 0}
              />

              {leftList[mealType].map((item, index) => (
                <MealItem
                  key={`left-${mealType}-${item.id}-${index}`}
                  item={item}
                  isSelected={selectedItem?.id === item.id}
                  onSelect={handleItemSelect}
                />
              ))}
            </View>
          ))}
        </ScrollView>

        {/* Liste des repas consommés (droite) */}
        <ScrollView
          style={styles.listScrollContainer}
          contentContainerStyle={styles.listContentContainer}
        >
          {mealTypes.map((mealType) => (
            <View key={`right-${mealType}`} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>
                {mealType === 'breakfast'
                  ? 'Petit déjeuner'
                  : mealType === 'lunch'
                  ? 'Déjeuner'
                  : mealType === 'dinner'
                  ? 'Dîner'
                  : 'Collations'}
              </Text>

              <TargetArea
                title="Ajouter ici"
                onSelect={() => selectedItem && handleMoveToConsumed(mealType)}
                isSelectionMode={selectionMode && selectedItem !== null}
                isEmpty={rightList[mealType].length === 0}
              />

              {rightList[mealType].map((item, index) => (
                <MealItem
                  key={`right-${mealType}-${item.id}-${index}`}
                  item={item}
                  isSelected={selectedItem?.id === item.id}
                  onSelect={handleItemSelect}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  headerItem: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  listsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listScrollContainer: {
    flex: 1,
    maxWidth: LIST_WIDTH,
    marginHorizontal: 4,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  categoryContainer: {
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 8,
  },
  categoryTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    backgroundColor: '#e0e0e0',
    paddingVertical: 4,
    borderRadius: 4,
  },
  item: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedItem: {
    borderColor: 'blue',
    borderWidth: 2,
    backgroundColor: '#f0f8ff',
  },
  itemText: {
    fontWeight: 'bold',
  },
  mealTypeText: {
    fontSize: 12,
    color: 'gray',
  },
  nutritionText: {
    fontSize: 12,
    marginTop: 4,
  },
  targetArea: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  activeTargetArea: {
    backgroundColor: '#e6f7ff',
    borderColor: '#1890ff',
  },
  targetAreaText: {
    color: '#666',
  },
  toastText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MealsClickSelection;
