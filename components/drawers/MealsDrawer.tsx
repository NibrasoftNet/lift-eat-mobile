import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { getMealsList } from '@/utils/services/meal.service';
import { CircleChevronDown, SearchIcon, MinusCircle, PlusCircle } from 'lucide-react-native';
/* Custom Providers */
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite/driver';
import * as schema from '@/db/schema'; // Importation du schéma pour le typage
/* Types */
import { MealOrmProps } from '@/db/schema';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';
/* Custom components */
import MealCard from '@/components/cards/MealCard';
/* Gluestack ui components */
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useToast, Toast, ToastTitle } from '@/components/ui/toast';
import { Box } from '@/components/ui/box';
import { Image, ScrollView } from 'react-native';
import { cuisineOptions, mealsTypeOptions } from '@/utils/constants/constant';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Divider } from '@/components/ui/divider';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface MealsDrawerProps {
  showMealsDrawer: boolean;
  setShowMealsDrawer: Dispatch<SetStateAction<boolean>>;
  dailyPlanId: number;
  planId: number;
  onMealsAdded?: () => Promise<void>;
  drizzleDb: ExpoSQLiteDatabase<typeof schema>;
  onAddMealToPlan: (dailyPlanId: number, mealId: number, quantity: number) => Promise<boolean>;
}

// Version simplifiée du composant MealCard pour le contexte du drawer
const SimpleMealCard: React.FC<{
  item: MealOrmProps;
  index: number;
  isSelected: boolean;
  onToggle: () => void;
  onAdjustQuantity: (newQuantity: number) => void;
  quantity?: number;
}> = ({ item, index, isSelected, onToggle, onAdjustQuantity, quantity = 10 }) => {
  const [inputQuantity, setInputQuantity] = useState(quantity.toString());

  const handleQuantityChange = (value: string) => {
    const newValue = parseInt(value) || 0;
    setInputQuantity(value);
    if (newValue > 0) {
      onAdjustQuantity(newValue);
    }
  };

  const adjustQuantity = (increment: boolean) => {
    const step = 10;
    const newQuantity = increment ? quantity + step : Math.max(1, quantity - step);
    setInputQuantity(newQuantity.toString());
    onAdjustQuantity(newQuantity);
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50)}
      className="mb-2"
    >
      <Pressable 
        onPress={onToggle}
        className={`border-2 rounded-lg p-3 ${
          isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'
        }`}
      >
        <HStack className="justify-between items-center">
          <VStack space="xs">
            <Text className="font-semibold">{item.name}</Text>
            <HStack space="sm">
              <Box className="bg-secondary-100 px-2 py-1 rounded">
                <Text className="text-xs">{item.type}</Text>
              </Box>
              <Box className="bg-red-100 px-2 py-1 rounded">
                <Text className="text-xs text-red-500">{item.calories} Kcal</Text>
              </Box>
              {item.cuisine && (
                <Box className="bg-secondary-100 px-2 py-1 rounded">
                  <Text className="text-xs">{item.cuisine}</Text>
                </Box>
              )}
            </HStack>
          </VStack>
          
          <Box 
            className={`rounded-full p-2 ${
              isSelected ? 'bg-primary-500' : 'bg-gray-200'
            }`}
          >
            <Text className={`text-${isSelected ? 'white' : 'gray-600'}`}>
              {isSelected ? '✓' : '+'}
            </Text>
          </Box>
        </HStack>
        
        {isSelected && (
          <HStack space="sm" className="mt-2 items-center justify-end">
            <Pressable onPress={() => adjustQuantity(false)}>
              <MinusCircle size={24} color="#666" />
            </Pressable>
            <Input
              size="sm"
              variant="outline"
              className="w-20"
            >
              <InputField
                textAlign="center"
                value={inputQuantity}
                onChangeText={handleQuantityChange}
                inputMode="numeric"
              />
            </Input>
            <Text className="text-gray-600">g</Text>
            <Pressable onPress={() => adjustQuantity(true)}>
              <PlusCircle size={24} color="#666" />
            </Pressable>
          </HStack>
        )}
      </Pressable>
    </Animated.View>
  );
};

interface MealQuantities {
  [mealId: number]: number;
}

const MealsDrawer: React.FC<MealsDrawerProps> = ({
  showMealsDrawer,
  setShowMealsDrawer,
  dailyPlanId,
  planId,
  onMealsAdded,
  drizzleDb,
  onAddMealToPlan,
}) => {
  // États pour la gestion des filtres et de la recherche
  const [searchMealName, setSearchMealName] = useState<string | undefined>(undefined);
  const [selectedMealType, setSelectedMealType] = useState<MealTypeEnum | undefined>(undefined);
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineTypeEnum | undefined>(undefined);
  // État pour les repas sélectionnés
  const [selectedMeals, setSelectedMeals] = useState<MealOrmProps[]>([]);
  const [mealQuantities, setMealQuantities] = useState<MealQuantities>({});
  
  // Hooks utilisables partout
  const toast = useToast();
  const queryClient = useQueryClient();

  // Réinitialiser la sélection quand le drawer se ferme
  useEffect(() => {
    if (!showMealsDrawer) {
      setSelectedMeals([]);
    }
  }, [showMealsDrawer]);

  // Requête pour récupérer les repas
  const {
    data: mealsList,
    isLoading,
    isFetching,
    isPending,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['meals', selectedMealType, selectedCuisine, searchMealName],
    queryFn: async () => 
      await getMealsList(
        drizzleDb,
        selectedCuisine,
        selectedMealType,
        searchMealName,
      ),
    enabled: showMealsDrawer, // Activer la requête uniquement lorsque le drawer est visible
  });

  // Fonction pour gérer la recherche par nom
  const handleMealNameSearch = async (mealName: string | undefined) => {
    setSearchMealName(mealName);
    await refetch();
  };

  // Fonction pour gérer la sélection d'un type de cuisine
  const handleCuisineSelect = async (cuisine: CuisineTypeEnum | undefined) => {
    setSelectedCuisine(cuisine);
    await refetch();
  };

  // Fonction pour gérer la sélection d'un type de repas
  const handleMealTypeSelect = async (mealType: MealTypeEnum | undefined) => {
    setSelectedMealType(mealType);
    await refetch();
  };

  // Fonction pour gérer la sélection des repas
  const handleMealToggle = (meal: MealOrmProps) => {
    const isSelected = selectedMeals.some((m) => m.id === meal.id);
    
    if (isSelected) {
      // Désélectionner le repas
      setSelectedMeals(selectedMeals.filter((m) => m.id !== meal.id));
      
      // Supprimer la quantité enregistrée pour ce repas
      const updatedQuantities = { ...mealQuantities };
      delete updatedQuantities[meal.id];
      setMealQuantities(updatedQuantities);
    } else {
      // Sélectionner le repas et initialiser sa quantité
      setSelectedMeals([...selectedMeals, meal]);
      setMealQuantities({
        ...mealQuantities,
        [meal.id]: 10, // Valeur par défaut (10g)
      });
    }
  };
  
  // Fonction pour ajuster la quantité d'un repas sélectionné
  const adjustQuantity = (mealId: number, newQuantity: number) => {
    setMealQuantities({
      ...mealQuantities,
      [mealId]: newQuantity,
    });
  };

  // Fonction pour ajouter les repas sélectionnés au plan
  const handleAddMealsToPlan = async () => {
    if (selectedMeals.length === 0) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast action="error" variant="solid">
              <ToastTitle>Veuillez sélectionner au moins un repas</ToastTitle>
            </Toast>
          );
        },
      });
      return;
    }

    try {
      // Ajouter chaque repas sélectionné au plan journalier avec sa quantité personnalisée
      for (const meal of selectedMeals) {
        const mealQuantity = mealQuantities[meal.id] || 10; // Utiliser la quantité personnalisée ou 10 par défaut
        const success = await onAddMealToPlan(dailyPlanId, meal.id, mealQuantity);
        if (!success) {
          throw new Error("Erreur lors de l'ajout du repas au plan");
        }
      }
      
      // Afficher un message de succès
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast action="success" variant="solid">
              <ToastTitle>
                {selectedMeals.length > 1
                  ? `${selectedMeals.length} repas ajoutés au plan`
                  : "Repas ajouté au plan"}
              </ToastTitle>
            </Toast>
          );
        },
      });
      
      // Vider la sélection et fermer le drawer
      setSelectedMeals([]);
      setMealQuantities({});
      setShowMealsDrawer(false);
      
      // Callback pour rafraîchir les données du plan
      if (onMealsAdded) {
        await onMealsAdded();
      }
      
    } catch (error) {
      console.error("Erreur lors de l'ajout des repas:", error);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast action="error" variant="solid">
              <ToastTitle>Erreur lors de l'ajout des repas</ToastTitle>
            </Toast>
          );
        },
      });
    }
  };

  return (
    <Drawer
      isOpen={showMealsDrawer}
      onClose={() => setShowMealsDrawer(false)}
      size="lg"
      anchor="bottom"
    >
      <DrawerBackdrop />
      <DrawerContent className="bg-secondary-100 p-2">
        <DrawerHeader className="flex items-center justify-between w-full border-b border-secondary-300 p-2">
          <Heading size="xl" className="text-center font-semibold">
            {selectedMeals.length > 0 
              ? `${selectedMeals.length} repas sélectionné(s)` 
              : "Ajouter des repas"}
          </Heading>
          <Button
            onPress={() => setShowMealsDrawer(false)}
            className="bg-transparent w-12 h-12"
            action="secondary"
          >
            <ButtonIcon as={CircleChevronDown} className="w-10 h-10" />
          </Button>
        </DrawerHeader>

        <DrawerBody>
          <VStack className="gap-2 flex-1">
            {/* Champ de recherche */}
            <Input
              variant="outline"
              className="bg-white/90 rounded-xl h-12 p-1"
            >
              <InputIcon as={SearchIcon} className="text-gray-400" />
              <InputField
                placeholder="Rechercher un repas..."
                value={searchMealName}
                onChangeText={handleMealNameSearch}
              />
            </Input>

            {/* Filtres par cuisine */}
            <Box className="w-full h-18 py-1">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 8,
                  paddingHorizontal: 4
                }}
              >
                <>
                  <Button
                    onPress={() => handleCuisineSelect(undefined)}
                    className={`bg-transparent p-2 rounded-full h-14 w-14 border-2 ${
                      selectedCuisine === undefined
                        ? 'border-amber-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <ButtonText className="text-black text-xs">Tous</ButtonText>
                  </Button>
                  {cuisineOptions.map((cuisineType) => (
                    <VStack key={cuisineType.name} className="w-14 h-16 items-center">
                      <Button
                        onPress={() => handleCuisineSelect(cuisineType.name)}
                        className={`bg-transparent p-2 rounded-full h-14 w-14 border-2 ${
                          selectedCuisine === cuisineType.name
                            ? 'border-amber-500'
                            : 'border-gray-200'
                        }`}
                      >
                        {cuisineType.icon ? (
                          <Image
                            source={cuisineType.icon}
                            className="h-10 w-10 object-contain rounded-full"
                            style={{ alignSelf: 'center' }}
                          />
                        ) : (
                          <Text className="text-center">{cuisineType.name}</Text>
                        )}
                      </Button>
                      <Text className="text-xs capitalize">{cuisineType.name}</Text>
                    </VStack>
                  ))}
                </>
              </ScrollView>
            </Box>
            
            <Divider orientation="horizontal" className="h-0.5 bg-gray-200 w-full" />
            
            {/* Filtres par type de repas */}
            <Box className="w-full h-18 py-1">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 8,
                  paddingHorizontal: 4
                }}
              >
                <>
                  <Button
                    onPress={() => handleMealTypeSelect(undefined)}
                    className={`bg-transparent p-2 rounded-full h-14 w-14 border-2 ${
                      selectedMealType === undefined
                        ? 'border-amber-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <ButtonText className="text-black text-xs">Tous</ButtonText>
                  </Button>
                  {mealsTypeOptions.map((mealType) => (
                    <VStack key={mealType.name} className="w-14 h-16 items-center">
                      <Button
                        onPress={() => handleMealTypeSelect(mealType.name)}
                        className={`bg-transparent p-2 rounded-full h-14 w-14 border-2 ${
                          selectedMealType === mealType.name
                            ? 'border-amber-500'
                            : 'border-gray-200'
                        }`}
                      >
                        {mealType.icon ? (
                          <Image
                            source={mealType.icon}
                            className="h-10 w-10 object-contain rounded-full"
                            style={{ alignSelf: 'center' }}
                          />
                        ) : (
                          <Text className="text-center">{mealType.name}</Text>
                        )}
                      </Button>
                      <Text className="text-xs capitalize">{mealType.name}</Text>
                    </VStack>
                  ))}
                </>
              </ScrollView>
            </Box>

            {/* Liste des repas */}
            <Box className="flex-1">
              <QueryStateHandler<MealOrmProps>
                data={mealsList}
                isLoading={isLoading}
                isFetching={isFetching}
                isPending={isPending}
                isRefetching={isRefetching}
              >
                {mealsList?.length === 0 ? (
                  <VStack className="items-center justify-center p-4 h-40">
                    <IconSymbol name="house.fill" size={24} color={"#000"} />
                    <Text className="text-gray-500 mt-2">Aucun repas trouvé. Ajustez vos filtres.</Text>
                  </VStack>
                ) : (
                  <FlashList
                    data={mealsList}
                    renderItem={({ item, index }) => (
                      <SimpleMealCard 
                        item={item} 
                        index={index}
                        isSelected={selectedMeals.some(meal => meal.id === item.id)}
                        onToggle={() => handleMealToggle(item)}
                        onAdjustQuantity={(newQuantity) => adjustQuantity(item.id, newQuantity)}
                        quantity={mealQuantities[item.id]}
                      />
                    )}
                    keyExtractor={(item) => String(item.id)}
                    estimatedItemSize={20}
                    contentContainerStyle={{ padding: 8 }}
                  />
                )}
              </QueryStateHandler>
            </Box>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <HStack space="md">
            <Button
              className="flex-1"
              onPress={() => {
                setSelectedMeals([]);
                setShowMealsDrawer(false);
              }}
              variant="outline"
            >
              <ButtonText>Annuler</ButtonText>
            </Button>
            <Button
              className="flex-1"
              onPress={handleAddMealsToPlan}
              disabled={selectedMeals.length === 0}
            >
              <ButtonText>
                Ajouter {selectedMeals.length > 0 ? `(${selectedMeals.length})` : ''}
              </ButtonText>
            </Button>
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MealsDrawer;
