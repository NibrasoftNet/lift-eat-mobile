import React, { useState } from 'react';
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

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

type Item = {
  id: string;
  text: string;
  mealType: MealType;
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
                <Text>{item.text}</Text>
                <Text style={styles.mealTypeText}>{item.mealType}</Text>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </TapGestureHandler>
      </Animated.View>
    </LongPressGestureHandler>
  );
};

const MealsSelect = () => {
  const initialLeftList: MealList = {
    breakfast: [
      { id: '1', text: 'Oatmeal', mealType: 'breakfast' },
      { id: '2', text: 'Yogurt', mealType: 'breakfast' },
    ],
    lunch: [
      { id: '3', text: 'Salad', mealType: 'lunch' },
      { id: '4', text: 'Sandwich', mealType: 'lunch' },
    ],
    dinner: [
      { id: '5', text: 'Pasta', mealType: 'dinner' },
      { id: '6', text: 'Steak', mealType: 'dinner' },
    ],
    snacks: [
      { id: '7', text: 'Fruits', mealType: 'snacks' },
      { id: '8', text: 'Nuts', mealType: 'snacks' },
    ],
  };

  const initialRightList: MealList = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };

  const [leftList, setLeftList] = useState<MealList>(initialLeftList);
  const [rightList, setRightList] = useState<MealList>(initialRightList);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleDragStart = (id: string) => {
    setActiveId(id);
    // If the dragged item isn't selected, clear the selection
    if (!selectedItems.has(id)) {
      setSelectedItems(new Set([id]));
    }
  };

  const handleDragEnd = (
    id: string,
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

      setSelectedItems(new Set());
    }
  };

  const toggleItemSelection = (id: string) => {
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
            {list[mealType].map((item) => (
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
            ))}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.listsContainer}>
        {/* Left List */}
        <View style={[styles.list, styles.leftList]}>
          <Text style={styles.listTitle}>Available Meals</Text>
          {renderSublist(leftList, true)}
        </View>

        {/* Right List */}
        <View style={[styles.list, styles.rightList]}>
          <Text style={styles.listTitle}>Selected Meals</Text>
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
    backgroundColor: '#e3f2fd',
  },
  rightList: {
    backgroundColor: '#fff8e1',
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
    borderWidth: 1,
  },
  activeItem: {
    borderColor: '#2196f3',
    backgroundColor: '#bbdefb',
  },
  inactiveItem: {
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  selectedItem: {
    borderColor: '#4caf50',
    backgroundColor: '#c8e6c9',
  },
  mealTypeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default MealsSelect;
