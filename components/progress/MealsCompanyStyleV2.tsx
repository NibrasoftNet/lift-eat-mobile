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
import { MealOrmProps, DailyProgressOrmProps, DailyMealProgressOrmProps } from '@/db/schema';
import useProgressStore, { MealWithProgress } from '@/utils/store/progressStore';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { markMealAsConsumed } from '@/utils/services/progress.service';
import { useToast } from '../ui/toast';
import { Box } from '../ui/box';

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
  item: Item;
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
  const drizzleDb = useDrizzleDb();
  const toast = useToast();
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
  const [activeId, setActiveId] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

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
    console.log("MealsCompanyStyleV2 - Initialisation avec", mealsWithProgress.length, "repas");
    
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

  const handleDragStart = (id: number) => {
    setActiveId(id);
    // If the dragged item isn't selected, clear the selection
    if (!selectedItems.has(id)) {
      setSelectedItems(new Set([id]));
    }
  };

  // Handler for when a drag operation ends
  const handleDragEnd = async (
    id: number,
    droppedOnRight: boolean,
    droppedOnMealType: MealType,
  ) => {
    setActiveId(null);

    // Detect source (where the selected item(s) currently are)
    let sourceList: MealList;
    let setSourceList: React.Dispatch<React.SetStateAction<MealList>>;
    let targetList: MealList;
    let setTargetList: React.Dispatch<React.SetStateAction<MealList>>;

    const itemInLeftList = Object.values(leftList).some((items) =>
      items.some((i) => selectedItems.has(i.id)),
    );

    if (itemInLeftList) {
      sourceList = leftList;
      setSourceList = setLeftList;
      targetList = droppedOnRight ? rightList : leftList;
      setTargetList = droppedOnRight ? setRightList : setLeftList;
    } else {
      sourceList = rightList;
      setSourceList = setRightList;
      targetList = droppedOnRight ? rightList : leftList;
      setTargetList = droppedOnRight ? setRightList : setLeftList;
    }

    // Gather selected items
    let foundItems: Item[] = [];
    for (const mealType of mealTypes) {
      foundItems.push(
        ...sourceList[mealType].filter((i) => selectedItems.has(i.id)),
      );
    }

    if (foundItems.length > 0) {
      const updatedItems = foundItems.map((item) => ({
        ...item,
        mealType: droppedOnMealType,
      }));

      // Remove from source
      setSourceList((prev) => {
        const newList = { ...prev };
        for (const mealType of mealTypes) {
          newList[mealType] = newList[mealType].filter(
            (i) => !selectedItems.has(i.id),
          );
        }
        return newList;
      });

      // Add to target
      setTargetList((prev) => ({
        ...prev,
        [droppedOnMealType]: [...prev[droppedOnMealType], ...updatedItems],
      }));

      // Update meal status in the database for each moved item
      try {
        for (const item of foundItems) {
          if (!dailyProgress) {
            throw new Error('Données de progression quotidienne manquantes');
          }

          if (!item.dailyPlanMealId) {
            throw new Error('Identifiant de repas quotidien manquant');
          }

          // Call service to mark meal as consumed or not consumed
          await markMealAsConsumed(
            drizzleDb,
            dailyProgress.id,
            item.id,
            item.dailyPlanMealId,
            droppedOnRight // true if consumed, false if not consumed
          );
        }

        // Show success notification
        toast.show({
          placement: "top",
          render: () => (
            <Box className="bg-green-600 px-4 py-3 rounded-sm mb-5">
              <Text style={styles.toastText}>
                {droppedOnRight 
                  ? 'Repas marqué comme consommé !' 
                  : 'Repas remis dans la liste "à consommer"'}
              </Text>
            </Box>
          )
        });

        // Notify parent component to refresh data
        onMealStatusChange();
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

      setSelectedItems(new Set());
    }
  };

  const toggleItemSelection = (id: number) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);
  };

  const renderSublist = (list: MealList, isLeftList: boolean) => {
    return (
      <ScrollView style={styles.scrollContainer}>
        {mealTypes.map((mealType) => (
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
          {renderSublist(leftList, true)}
        </View>

        {/* Right List */}
        <View style={[styles.list, styles.rightList]}>
          <Text style={styles.listTitle}>Consommés</Text>
          {renderSublist(rightList, false)}
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
