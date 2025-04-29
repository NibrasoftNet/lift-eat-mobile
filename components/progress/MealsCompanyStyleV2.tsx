import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
  TapGestureHandler,
  LongPressGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { DailyProgressOrmProps } from '@/db/schema';
import useProgressStore, { MealWithProgress } from '@/utils/store/progressStore';
import { useToast } from '../ui/toast';
import { Box } from '../ui/box';
import { 
  mealsCompanyStyleService, 
  MealItem, 
  MealType, 
  MealList, 
  MealListsState 
} from '@/utils/services/meals-company-style.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { logger } from '@/utils/services/logging.service';
import { useQueryClient } from '@tanstack/react-query';
import { progressPagesService } from '@/utils/services/pages/progress-pages.service';

// Extension du type MealWithProgress pour inclure dailyPlanMealId
interface MealWithProgressExtended extends MealWithProgress {
  dailyPlanMealId?: number;
}

interface MealsCompanyStyleV2Props {
  selectedDate: string;
  dailyProgress: DailyProgressOrmProps;
  mealsWithProgress: MealWithProgress[];
  onMealStatusChange: () => void;
}

const { width, height } = Dimensions.get('window');
const LIST_WIDTH = width / 2 - 10;
const SUBLIST_HEIGHT = height / 4 - 30;

const DraggableItem = ({
  item,
  onDragStart,
  onDragEnd,
  isActive,
  isSelected,
  onSelect,
}: {
  item: MealItem;
  onDragStart: () => void;
  onDragEnd: (droppedOnRight: boolean, droppedOnMealType: MealType) => void;
  isActive: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    zIndex: isActive ? 100 : 1,
    opacity: isActive ? 0.8 : 1,
  }));

  return (
    <LongPressGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          runOnJS(onSelect)();
        }
      }}
    >
      <Animated.View>
        <TapGestureHandler
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.ACTIVE) {
              startX.value = nativeEvent.absoluteX;
              startY.value = nativeEvent.absoluteY;
              runOnJS(onDragStart)();
            }
          }}
        >
          <Animated.View>
            <PanGestureHandler
              onGestureEvent={({ nativeEvent }) => {
                if (isActive) {
                  translateX.value = nativeEvent.absoluteX - startX.value;
                  translateY.value = nativeEvent.absoluteY - startY.value;
                }
              }}
              onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.END && isActive) {
                  const droppedOnRight = nativeEvent.absoluteX > width / 2;

                  // Calculate which meal type sublist the item was dropped on
                  const absoluteY = nativeEvent.absoluteY;
                  const relativeY = absoluteY - (height - SUBLIST_HEIGHT * 4);
                  let droppedOnMealType: MealType = 'breakfast';

                  if (relativeY < SUBLIST_HEIGHT) {
                    droppedOnMealType = 'breakfast';
                  } else if (relativeY < SUBLIST_HEIGHT * 2) {
                    droppedOnMealType = 'lunch';
                  } else if (relativeY < SUBLIST_HEIGHT * 3) {
                    droppedOnMealType = 'dinner';
                  } else {
                    droppedOnMealType = 'snacks';
                  }

                  console.log("Dropped at:", {
                    x: nativeEvent.absoluteX,
                    y: nativeEvent.absoluteY,
                    relativeY,
                    droppedOnRight,
                    droppedOnMealType
                  });

                  translateX.value = withSpring(0);
                  translateY.value = withSpring(0);
                  runOnJS(onDragEnd)(droppedOnRight, droppedOnMealType);
                }
              }}
            >
              <Animated.View
                style={[
                  styles.item,
                  isActive ? styles.activeItem : styles.inactiveItem,
                  isSelected && styles.selectedItem,
                  animatedStyle,
                ]}
              >
                <Text>{item.name}</Text>
                <Text style={styles.mealTypeText}>{item.type}</Text>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </TapGestureHandler>
      </Animated.View>
    </LongPressGestureHandler>
  );
};

const MealsCompanyStyleV2: React.FC<MealsCompanyStyleV2Props> = ({
  selectedDate,
  dailyProgress,
  mealsWithProgress,
  onMealStatusChange,
}) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { setMealsWithProgress } = useProgressStore();

  // Initialiser les états locaux
  const initialState: MealListsState = {
    leftList: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    },
    rightList: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    }
  };

  const [mealListsState, setMealListsState] = useState<MealListsState>(initialState);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // Initialiser les listes de repas lors du chargement du composant
  useEffect(() => {
    logger.info(LogCategory.PERFORMANCE, 'MealsCompanyStyleV2 - Initialisation', { count: mealsWithProgress.length });
    
    // Utiliser le service pour initialiser les listes
    const newState = mealsCompanyStyleService.initializeMealLists(mealsWithProgress);
    setMealListsState(newState);
    setMealsWithProgress(mealsWithProgress);
  }, [mealsWithProgress, setMealsWithProgress]);

  const handleDragStart = (id: number) => {
    setActiveId(id);
    // Si l'élément déplacé n'est pas sélectionné, effacer la sélection actuelle
    if (!selectedItems.has(id)) {
      setSelectedItems(new Set([id]));
    }
  };

  // Gestionnaire pour la fin d'une opération de glisser-déposer
  const handleDragEnd = async (
    id: number,
    droppedOnRight: boolean,
    droppedOnMealType: MealType,
  ) => {
    logger.debug(LogCategory.UI, 'Fin du drag and drop', { id, droppedOnRight, mealType: droppedOnMealType });
    setActiveId(null);

    // Utiliser le service pour mettre à jour les listes
    const { updatedState, movedItems } = mealsCompanyStyleService.updateMealLists(
      mealListsState,
      selectedItems,
      droppedOnRight,
      droppedOnMealType
    );

    if (movedItems.length > 0) {
      // Mettre à jour l'état local immédiatement
      setMealListsState(updatedState);

      // Mettre à jour le statut de consommation dans la base de données
      try {
        if (!dailyProgress) {
          throw new Error('Données de progression quotidienne manquantes');
        }

        // Utiliser le service pour mettre à jour les statuts dans la BD
        const result = await mealsCompanyStyleService.updateMealsStatus(
          queryClient,
          dailyProgress.id,
          movedItems,
          droppedOnRight
        );

        // Afficher la notification de succès
        if (result.success) {
          toast.show({
            placement: "top",
            render: () => (
              <Box className="bg-green-600 px-4 py-3 rounded-sm mb-5">
                <Text style={styles.toastText}>{result.message}</Text>
              </Box>
            )
          });

          // Notifier le composant parent pour rafraîchir les données
          onMealStatusChange();
        } else {
          throw new Error(result.message);
        }
      } catch (error: any) {
        toast.show({
          placement: "top",
          render: () => (
            <Box className="bg-red-600 px-4 py-3 rounded-sm mb-5">
              <Text style={styles.toastText}>
                Erreur: {error.message || 'Une erreur est survenue'}
              </Text>
            </Box>
          )
        });
      }

      // Réinitialiser la sélection
      setSelectedItems(new Set());
    }
  };

  const toggleItemSelection = (id: number) => {
    // Utiliser le service pour basculer la sélection d'un élément
    const newSelection = mealsCompanyStyleService.toggleItemSelection(selectedItems, id);
    setSelectedItems(newSelection);
  };

  const renderSublist = (list: MealList, isLeftList: boolean) => {
    return (
      <ScrollView style={styles.scrollContainer}>
        {mealsCompanyStyleService.mealTypes.map((mealType) => (
          <View key={mealType} style={[styles.sublist, styles.dottedBorder]}>
            <Text style={styles.sublistTitle}>
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </Text>
            {list[mealType].length === 0 ? (
              <Text style={styles.emptyText}>Aucun repas</Text>
            ) : (
              list[mealType].map((item) => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  isActive={activeId === item.id || selectedItems.has(item.id)}
                  isSelected={selectedItems.has(item.id)}
                  onDragStart={() => handleDragStart(item.id)}
                  onDragEnd={(droppedOnRight, droppedOnMealType) =>
                    handleDragEnd(item.id, droppedOnRight, droppedOnMealType)
                  }
                  onSelect={() => toggleItemSelection(item.id)}
                />
              ))
            )}
          </View>
        ))}
      </ScrollView>
    );
  };

  if (mealsWithProgress.length === 0) {
    return (
      <View style={styles.noMealsContainer}>
        <Text style={styles.noMealsText}>Aucun repas disponible pour cette date.</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.listsContainer}>
        {/* Left List */}
        <View style={[styles.list, styles.leftList]}>
          <Text style={styles.listTitle}>À consommer</Text>
          {renderSublist(mealListsState.leftList, true)}
        </View>

        {/* Right List */}
        <View style={[styles.list, styles.rightList]}>
          <Text style={styles.listTitle}>Consommés</Text>
          {renderSublist(mealListsState.rightList, false)}
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    flex: 1,
  },
  list: {
    width: LIST_WIDTH,
    padding: 10,
    margin: 5,
  },
  leftList: {
    backgroundColor: '#e3f2fd', // Light blue background for left list
  },
  rightList: {
    backgroundColor: '#fff8e1', // Light yellow background for right list
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sublist: {
    minHeight: SUBLIST_HEIGHT,
    marginBottom: 10,
  },
  dottedBorder: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#999',
    borderRadius: 5,
    padding: 5,
  },
  sublistTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  },
  item: {
    padding: 15,
    margin: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  activeItem: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    backgroundColor: '#f5f5f5',
  },
  inactiveItem: {},
  selectedItem: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  mealTypeText: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    padding: 10,
    fontStyle: 'italic',
    fontSize: 12,
  },
  noMealsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noMealsText: {
    fontSize: 16,
    color: '#666',
  },
  toastText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default MealsCompanyStyleV2;
