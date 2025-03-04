import React, { useState, useMemo } from 'react';
import { View, ImageBackground } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Box } from '@/components/ui/box';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { HStack } from '@/components/ui/hstack';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { Icon } from '@/components/ui/icon';
import { AddIcon, SearchIcon } from '@/components/ui/icon';
import { meals } from '@/utils/examples/meals.example';
import { MealFilters } from '@/components/ui/meal/filters/MealFilters';
import { MealSort, SortOption } from '@/components/ui/meal/filters/MealSort';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';
import { Meal } from '@/types/plan.type';
import { MealCard } from '@/components/ui/meal/MealCard';
import { ViewToggle, ViewMode } from '@/components/ui/meal/ViewToggle';

const backgroundImage = require('@/assets/images/backgrounds/default-bg.webp');

export default function TabMealsScreen() {
  const [selectedMeal, setSelectedMeal] = useState(meals[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<MealTypeEnum | ''>('');
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineTypeEnum | ''>('');
  const [sortBy, setSortBy] = useState<SortOption>('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const router = useRouter();

  const handleMealCardPress = (meal: Meal) => {
    setSelectedMeal(meal);
    router.push(`/(root)/(tabs)/meals/details/${meal.id}` as any);
  };

  const toggleFavorite = (mealId: string, event: any) => {
    event.stopPropagation();
    setFavorites(prev => 
      prev.includes(mealId) 
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );
  };

  const filteredAndSortedMeals = useMemo(() => {
    let result = [...meals];

    if (searchQuery) {
      result = result.filter(meal =>
        meal.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType) {
      result = result.filter(meal => meal.type === selectedType);
    }

    if (selectedCuisine) {
      result = result.filter(meal => meal.cuisineType === selectedCuisine);
    }

    if (sortBy) {
      result.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'calories':
            return b.calories - a.calories;
          case 'date':
            return 0;
          default:
            return 0;
        }
      });
    }

    return result;
  }, [meals, searchQuery, selectedType, selectedCuisine, sortBy]);

  const renderMeal = ({ item, index }: { item: Meal; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      style={viewMode === 'grid' ? { width: '50%' } : undefined}
    >
      <MealCard
        meal={item}
        isFavorite={favorites.includes(item.id)}
        onPress={() => handleMealCardPress(item)}
        onFavoritePress={(e) => toggleFavorite(item.id, e)}
        viewMode={viewMode}
      />
    </Animated.View>
  );

  const renderGridItem = ({ item, index }: { item: Meal; index: number }) => {
    if (index % 2 === 0) {
      const nextItem = filteredAndSortedMeals[index + 1];
      return (
        <View className="flex-row px-4">
          {renderMeal({ item, index })}
          {nextItem && renderMeal({ item: nextItem, index: index + 1 })}
        </View>
      );
    }
    return null;
  };

  return (
    <ImageBackground
      source={backgroundImage}
      className="flex-1"
      imageStyle={{ opacity: 0.2 }}
    >
      <Box className="flex-1 bg-transparent">
        <Box className="p-4">
          <HStack space="sm" className="mb-4 items-center">
            <Box className="flex-1">
              <Input variant="outline" className="bg-white/90 rounded-xl">
                <InputIcon as={SearchIcon} className="text-gray-400" />
                <InputField
                  placeholder="Search meals..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </Input>
            </Box>
            <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
          </HStack>

          <MealFilters
            selectedType={selectedType}
            selectedCuisine={selectedCuisine}
            onTypeChange={setSelectedType}
            onCuisineChange={setSelectedCuisine}
          />

          <MealSort
            selectedSort={sortBy}
            onSortChange={setSortBy}
          />
        </Box>

        <FlashList
          data={viewMode === 'grid' 
            ? filteredAndSortedMeals.filter((_, i) => i % 2 === 0)
            : filteredAndSortedMeals
          }
          renderItem={viewMode === 'grid' ? renderGridItem : renderMeal}
          estimatedItemSize={viewMode === 'grid' ? 300 : 400}
          numColumns={viewMode === 'grid' ? 1 : 1}
          contentContainerStyle={viewMode === 'grid' ? undefined : { padding: 16 }}
        />

        <Fab
          size="md"
          placement="bottom right"
          isHovered={false}
          isDisabled={false}
          isPressed={false}
          onPress={() => router.push('/(root)/(tabs)/meals/create' as any)}
        >
          <FabIcon as={AddIcon} />
          <FabLabel>Nouveau repas</FabLabel>
        </Fab>
      </Box>
    </ImageBackground>
  );
}
