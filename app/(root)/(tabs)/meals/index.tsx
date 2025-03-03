import React, { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { Link, useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { HStack } from '@/components/ui/hstack';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import { Divider } from '@/components/ui/divider';
import { Image } from '@/components/ui/image';
import { ImageBackground } from 'react-native';
import {
  AddIcon,
  EditIcon,
  GlobeIcon,
  Icon,
  ThreeDotsIcon,
  TrashIcon,
  SearchIcon,
} from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { meals } from '@/utils/examples/meals.example';
import { UtensilsCrossedIcon, Heart, HeartOff } from 'lucide-react-native';
import { balanceDiet } from '@/utils/constants/images';
import { Input, InputField, InputIcon } from '@/components/ui/input';

const mealBackground = require('@/assets/images/Meals/SushiBowlauSaumon.jpj.jpg');

export default function TabMealsScreen() {
  const [selectedMeal, setSelectedMeal] = useState(meals[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const router = useRouter();

  const handleMealCardPress = (meal: typeof meals[0]) => {
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

  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMeal = ({ item, index }: { item: typeof meals[0]; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      className="mb-4"
    >
      <Pressable
        onPress={() => handleMealCardPress(item)}
        className="bg-white rounded-xl overflow-hidden shadow-sm"
      >
        <Box className="relative">
          <Image
            source={item.image}
            className="w-full h-32 rounded-t-xl"
            resizeMode="cover"
          />
          <Pressable
            onPress={(e) => toggleFavorite(item.id, e)}
            className="absolute top-2 right-2 p-2 bg-white/80 rounded-full"
          >
            <Icon
              as={favorites.includes(item.id) ? Heart : HeartOff}
              size="md"
              className={favorites.includes(item.id) ? "text-red-500" : "text-gray-500"}
            />
          </Pressable>
        </Box>

        <VStack space="md" className="p-4">
          <HStack className="w-full flex justify-between items-center">
            <HStack className="flex items-center gap-2">
              <Icon as={UtensilsCrossedIcon} className="w-8 h-8 text-primary-700" />
              <VStack>
                <Text className="text-lg font-semibold text-gray-900">
                  {item.name}
                </Text>
                <Text className="text-sm text-gray-500">
                  {item.type} • {item.cuisineType}
                </Text>
              </VStack>
            </HStack>

            <Menu
              placement="bottom right"
              trigger={({ ...triggerProps }) => (
                <Button
                  {...triggerProps}
                  variant="link"
                  className="rounded-full"
                  size="sm"
                >
                  <ButtonIcon as={ThreeDotsIcon} />
                </Button>
              )}
            >
              <MenuItem key="edit" textValue="Edit">
                <Link href={`/(root)/(tabs)/meals/${item.id}/edit` as any}>
                  <HStack space="sm" className="px-3 py-2">
                    <Icon as={EditIcon} className="text-gray-600" />
                    <MenuItemLabel>Edit</MenuItemLabel>
                  </HStack>
                </Link>
              </MenuItem>
              <MenuItem key="delete" textValue="Delete">
                <HStack space="sm" className="px-3 py-2">
                  <Icon as={TrashIcon} className="text-gray-600" />
                  <MenuItemLabel>Delete</MenuItemLabel>
                </HStack>
              </MenuItem>
            </Menu>
          </HStack>

          <Divider />

          <Box>
            <Text className="text-sm font-medium text-gray-900 mb-2">
              Nutritional Values
            </Text>
            <HStack className="justify-between">
              <VStack className="items-center">
                <Text className="text-sm font-semibold text-primary-600">
                  {item.calories}
                </Text>
                <Text className="text-xs text-gray-500">Calories</Text>
              </VStack>
              <VStack className="items-center">
                <Text className="text-sm font-semibold text-primary-600">
                  {item.protein}g
                </Text>
                <Text className="text-xs text-gray-500">Protein</Text>
              </VStack>
              <VStack className="items-center">
                <Text className="text-sm font-semibold text-primary-600">
                  {item.carbs}g
                </Text>
                <Text className="text-xs text-gray-500">Carbs</Text>
              </VStack>
              <VStack className="items-center">
                <Text className="text-sm font-semibold text-primary-600">
                  {item.fats}g
                </Text>
                <Text className="text-xs text-gray-500">Fats</Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </Pressable>
    </Animated.View>
  );

  return (
    <Box className="flex-1">
      <ImageBackground
        source={mealBackground}
        className="flex-1"
        blurRadius={25}
      >
        <Box className="flex-1 bg-black/10">
          {/* Barre de recherche */}
          <Box className="pt-12 px-4 pb-4">
            <HStack className="justify-between items-center mb-4">
              <Text className="text-2xl font-bold text-gray-900">
                Mes Repas
              </Text>
              <Link href="/(root)/(tabs)/meals/create" asChild>
                <Pressable>
                  <Icon as={AddIcon} size="lg" className="text-primary-600" />
                </Pressable>
              </Link>
            </HStack>

            <Input
              variant="rounded"
              size="md"
              className="bg-white/80"
            >
              <InputIcon as={SearchIcon} className="ml-3 text-gray-400" />
              <InputField
                placeholder="Rechercher un repas..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </Input>
          </Box>

          <FlashList
            data={filteredMeals}
            renderItem={renderMeal}
            estimatedItemSize={200}
            contentContainerStyle={{ padding: 16 }}
          />

          {/* Bouton flottant pour créer un nouveau repas */}
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
    </Box>
  );
}
