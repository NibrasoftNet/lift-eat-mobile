import React, { Dispatch, SetStateAction, useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { getCurrentUserIdSync } from '@/utils/helpers/userContext';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { CircleChevronDown, SearchIcon, MinusCircle, PlusCircle } from 'lucide-react-native';
/* Custom Providers */
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite/driver';
import * as schema from '@/db/schema'; // Importation du schéma pour le typage
/* Types */
import { MealOrmProps } from '@/db/schema';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';
import { createStableId, ItemType } from '@/utils/helpers/uniqueId';
import { monitorObjectExistence } from '@/utils/helpers/logging-interceptor';
import { invalidateCache, DataType } from '@/utils/helpers/queryInvalidation';
import { mealDrawerService } from '@/utils/services/meal-drawer.service';
import { MealWithQuantity } from '@/utils/interfaces/drawer.interface';

/* Custom components */
import SelectionDrawer from './SelectionDrawer';
/* Gluestack ui components */
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useToast, Toast, ToastTitle } from '@/components/ui/toast';
import { Box } from '@/components/ui/box';
import { Image, ScrollView, View } from 'react-native';
import { cuisineOptions, mealsTypeOptions } from '@/utils/constants/constant';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem
} from '@/components/ui/select';
import { Pressable } from '@/components/ui/pressable';
import { Divider } from '@/components/ui/divider';
import Animated, { FadeIn } from 'react-native-reanimated';

interface MealQuantities {
  [key: number]: number;
}

// Type pour gérer les types de repas spécifiques par ID de repas
interface MealTypes {
  [key: number]: MealTypeEnum;
}

interface MealsDrawerProps {
  showMealsDrawer: boolean;
  setShowMealsDrawer: Dispatch<SetStateAction<boolean>>;
  dailyPlanId: number;
  planId: number;
  onMealsAdded?: () => Promise<void>;
  drizzleDb: ExpoSQLiteDatabase<typeof schema>;
  onAddMealToPlan: (dailyPlanId: number, mealId: number, quantity: number, mealType?: MealTypeEnum) => Promise<{ success: boolean; error?: string; alreadyExists?: boolean }>;
}

// Version simplifiée du composant MealCard pour le contexte du drawer
const SimpleMealCard = React.memo(({ 
  item, 
  index, 
  isSelected, 
  onToggle, 
  onAdjustQuantity, 
  onMealTypeChange,
  quantity = 10,
  mealType
}: {
  item: MealOrmProps;
  index: number;
  isSelected: boolean;
  onToggle: () => void;
  onAdjustQuantity: (newQuantity: number) => void;
  onMealTypeChange?: (mealType: MealTypeEnum) => void;
  quantity?: number;
  mealType?: MealTypeEnum;
}) => {
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
      entering={FadeIn.delay(Math.min(index * 50, 500)).duration(300)}
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
              {isSelected && onMealTypeChange ? (
                <Select
                  defaultValue={mealType || item.type}
                  onValueChange={(value) => onMealTypeChange(value as MealTypeEnum)}
                  className="w-32"
                >
                  <SelectTrigger>
                    <SelectInput placeholder="Type de repas" />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem
                        label={mealDrawerService.getMealTypeName(MealTypeEnum.BREAKFAST)}
                        value={MealTypeEnum.BREAKFAST}
                      />
                      <SelectItem
                        label={mealDrawerService.getMealTypeName(MealTypeEnum.LUNCH)}
                        value={MealTypeEnum.LUNCH}
                      />
                      <SelectItem
                        label={mealDrawerService.getMealTypeName(MealTypeEnum.DINNER)}
                        value={MealTypeEnum.DINNER}
                      />
                      <SelectItem
                        label={mealDrawerService.getMealTypeName(MealTypeEnum.SNACK)}
                        value={MealTypeEnum.SNACK}
                      />
                    </SelectContent>
                  </SelectPortal>
                </Select>
              ) : (
                <View
                  className={`rounded-full px-2 py-1 ${mealDrawerService.getMealTypeColor(mealType || item.type).bgColor}`}
                >
                  <Text
                    className={`text-xs font-light ${mealDrawerService.getMealTypeColor(mealType || item.type).textColor}`}
                  >
                    {mealDrawerService.getMealTypeName(mealType || item.type)}
                  </Text>
                </View>
              )}
              <Box className="bg-secondary-100 px-2 py-1 rounded">
                <Text className="text-xs">{item.type}</Text>
              </Box>
              <Box className="bg-red-100 px-2 py-1 rounded">
                <Text className="text-xs text-red-500">{item.calories} Kcal</Text>
              </Box>
              {item.cuisine && (
                <Box className="bg-blue-100 px-2 py-1 rounded">
                  <Text className="text-xs text-blue-500">{item.cuisine}</Text>
                </Box>
              )}
            </HStack>
          </VStack>
          
          {isSelected && (
            <HStack className="items-center space-x-2">
              <Button
                size="sm"
                variant="link"
                onPress={() => adjustQuantity(false)}
                disabled={quantity <= 1}
              >
                <ButtonIcon as={MinusCircle} />
              </Button>
              <Text>{quantity}g</Text>
              <Button
                size="sm"
                variant="link"
                onPress={() => adjustQuantity(true)}
              >
                <ButtonIcon as={PlusCircle} />
              </Button>
            </HStack>
          )}
        </HStack>
      </Pressable>
    </Animated.View>
  );
});

function MealsDrawer({
  showMealsDrawer,
  setShowMealsDrawer,
  dailyPlanId,
  planId,
  onMealsAdded,
  drizzleDb,
  onAddMealToPlan,
}: MealsDrawerProps) {
  // États locaux
  const [searchMealName, setSearchMealName] = useState<string | undefined>(undefined);
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineTypeEnum | undefined>(undefined);
  const [selectedMealType, setSelectedMealType] = useState<MealTypeEnum | undefined>(undefined);
  const [selectedMeals, setSelectedMeals] = useState<MealOrmProps[]>([]);
  const [mealQuantities, setMealQuantities] = useState<MealQuantities>({});
  // Nouvel état pour stocker le type spécifique choisi pour chaque repas
  const [mealTypes, setMealTypes] = useState<Record<number, MealTypeEnum>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const toast = useToast();
  const queryClient = useQueryClient();
  const userId = useMemo(() => {
    const id = getCurrentUserIdSync();
    logger.debug(LogCategory.APP, `MealsDrawer - User ID: ${id}`);
    return id;
  }, []);

  // Réinitialisation des sélections quand le drawer s'ouvre ou se ferme
  useEffect(() => {
    if (!showMealsDrawer) {
      setSelectedMeals([]);
      setMealQuantities({});
    }
  }, [showMealsDrawer]);

  // Fonction pour récupérer la liste des repas
  const queryFn = useCallback(async () => {
    logger.info(LogCategory.DATABASE, 'MealsDrawer - Getting meals list', {
      search: searchMealName,
      cuisine: selectedCuisine,
      mealType: selectedMealType
    });

    if (!userId) {
      logger.error(LogCategory.AUTH, 'MealsDrawer - Cannot fetch meals: User not authenticated');
      throw new Error('User not authenticated');
    }

    try {
      // Récupérer les repas avec filtres
      const result = await sqliteMCPServer.getMealsListViaMCP(
        userId,
        selectedCuisine,
        selectedMealType,
        searchMealName
      );

      if (!result.success) {
        logger.error(LogCategory.DATABASE, `MealsDrawer - Failed to fetch meals: ${result.error}`);
        throw new Error(result.error || 'Failed to fetch meals');
      }

      // Traitement des résultats avec monitoring pour détecter "meal undefined"
      if (Array.isArray(result.meals)) {
        logger.debug(LogCategory.APP, `MealsDrawer - Received ${result.meals.length} meals`);
        
        // Ajouter un identifiant stable et unique à chaque repas
        const mealsWithStableIds = result.meals.map(meal => {
          // Vérifier si un repas est undefined et logger la source
          monitorObjectExistence('meal', meal, 'MealsDrawer.queryFn');
          
          if (meal) {
            return {
              ...meal,
              uniqueId: createStableId(ItemType.MEAL, meal.id)
            };
          }
          return null;
        }).filter(Boolean);
        
        return mealsWithStableIds;
      } else {
        logger.error(LogCategory.APP, 'MealsDrawer - Meals is not an array in queryFn', result);
        return [];
      }
    } catch (error) {
      logger.error(LogCategory.APP, `MealsDrawer - Error in queryFn: ${error}`);
      throw error;
    }
  }, [searchMealName, selectedCuisine, selectedMealType, userId]);

  // Configuration de la requête
  const {
    data: mealsList,
    isLoading,
    isPending,
    isRefetching,
    isFetching,
    refetch
  } = useQuery({
    queryKey: [DataType.MEALS_LIST, searchMealName, selectedCuisine, selectedMealType, userId],
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,    // 10 minutes
    enabled: !!userId && showMealsDrawer, // Désactiver si pas d'utilisateur ou si le drawer est fermé
  });

  // Fonction pour gérer la recherche par nom
  const handleMealNameSearch = useCallback((mealName: string | undefined) => {
    setSearchMealName(mealName);
  }, []);

  // Fonction pour filtrer les repas par type de cuisine
  const handleCuisineSelect = useCallback((cuisine?: CuisineTypeEnum) => {
    setSelectedCuisine(cuisine);
  }, []);

  // Fonction pour filtrer les repas par type de repas
  const handleMealTypeSelect = useCallback((mealType?: MealTypeEnum) => {
    setSelectedMealType(mealType);
  }, []);

  // Fonction pour gérer la sélection des repas
  const handleMealToggle = useCallback((meal: MealOrmProps) => {
    try {
      // Vérifier si le repas est valide
      monitorObjectExistence('meal', meal, 'MealsDrawer.handleMealToggle');
      
      if (!meal || typeof meal.id !== 'number') {
        logger.error(LogCategory.APP, 'MealsDrawer - Invalid meal in handleMealToggle', { meal });
        toast.show({
          render: ({ id }) => (
            <Toast nativeID={id} action="error" variant="solid">
              <ToastTitle>Erreur lors de la sélection du repas</ToastTitle>
            </Toast>
          ),
        });
        return;
      }

      setSelectedMeals(prev => {
        const isAlreadySelected = prev.some(selectedMeal => selectedMeal.id === meal.id);
        
        if (isAlreadySelected) {
          // Supprimer le repas de la sélection
          const newSelection = prev.filter(selectedMeal => selectedMeal.id !== meal.id);
          
          // Mettre à jour les quantités
          setMealQuantities(prevQuantities => {
            const newQuantities = { ...prevQuantities };
            delete newQuantities[meal.id];
            return newQuantities;
          });
          
          return newSelection;
        } else {
          // Ajouter le repas à la sélection avec une quantité par défaut de 100g
          setMealQuantities(prevQuantities => ({
            ...prevQuantities,
            [meal.id]: 100
          }));
          
          return [...prev, meal];
        }
      });
    } catch (error) {
      logger.error(LogCategory.APP, `MealsDrawer - Error in handleMealToggle: ${error}`);
    }
  }, [toast]);

  // Fonction pour ajuster la quantité d'un repas sélectionné
  const handleQuantityChange = useCallback((mealId: number, value: number) => {
    setMealQuantities(prev => ({
      ...prev,
      [mealId]: value,
    }));
  }, []);

  // Fonction pour changer le type d'un repas spécifique
  const handleMealTypeChange = useCallback((mealId: number, type: MealTypeEnum) => {
    setMealTypes(prev => ({
      ...prev,
      [mealId]: type,
    }));
  }, []);

  // Fonction pour ajouter les repas sélectionnés au plan en utilisant le service
  const handleAddMealsToPlan = useCallback(async () => {
    try {
      if (selectedMeals.length === 0) {
        toast.show({
          render: ({ id }) => (
            <Toast nativeID={id} action="warning" variant="solid">
              <ToastTitle>Aucun repas sélectionné</ToastTitle>
            </Toast>
          ),
        });
        return;
      }

      setIsSubmitting(true);
      logger.debug(LogCategory.APP, `MealsDrawer - Adding ${selectedMeals.length} meals to plan ${dailyPlanId}`);

      // Préparer les repas avec leurs quantités et types pour le service
      const mealsToAdd: MealWithQuantity[] = selectedMeals.map(meal => ({
        id: meal.id,
        quantity: mealQuantities[meal.id] || 100,
        mealType: mealTypes[meal.id]
      }));
      
      // Utiliser le service pour ajouter les repas au plan
      const result = await mealDrawerService.addMealsToPlan(dailyPlanId, planId, mealsToAdd);

      // Traiter les résultats
      if (!result.success && result.errors && result.errors.length > 0) {
        // Afficher un toast d'erreur
        toast.show({
          render: ({ id }) => (
            <Toast nativeID={id} action="error" variant="solid">
              <ToastTitle>Erreurs lors de l'ajout</ToastTitle>
              <VStack>
                {result.errors!.map((error, index) => (
                  <Text key={index} className="text-white">{error}</Text>
                ))}
              </VStack>
            </Toast>
          ),
        });
      } else {
        // Notification de succès
        toast.show({
          render: ({ id }) => (
            <Toast nativeID={id} action="success" variant="solid">
              <ToastTitle>
                {selectedMeals.length > 1
                  ? `Repas ajoutés au plan`
                  : `${selectedMeals[0]?.name || 'Repas'} ajouté au plan`}
              </ToastTitle>
            </Toast>
          ),
        });

        // Fermer le drawer et réinitialiser les sélections
        setSelectedMeals([]);
        setShowMealsDrawer(false);
        
        // Callback après ajout
        if (onMealsAdded) {
          await onMealsAdded();
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(LogCategory.APP, `Error adding meals to plan: ${errorMessage}`);
      
      // Afficher un toast d'erreur
      toast.show({
        render: ({ id }) => (
          <Toast nativeID={id} action="error" variant="solid">
            <ToastTitle>Erreur</ToastTitle>
            <Text className="text-white">{errorMessage}</Text>
          </Toast>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedMeals, mealQuantities, dailyPlanId, planId, onAddMealToPlan, onMealsAdded, queryClient, toast, setShowMealsDrawer]);

  // Composant de filtres pour les types de repas et cuisines
  const FiltersComponent = useCallback(() => (
    <>
      <Box className="py-2">
        <Text className="font-medium mb-2">Type de cuisine</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pb-1"
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
            {cuisineOptions.map((cuisine) => (
              <VStack key={cuisine.name} className="w-14 h-16 items-center">
                <Button
                  onPress={() => handleCuisineSelect(cuisine.name)}
                  className={`bg-transparent p-2 rounded-full h-14 w-14 border-2 ${
                    selectedCuisine === cuisine.name
                      ? 'border-amber-500'
                      : 'border-gray-200'
                  }`}
                >
                  {cuisine.icon ? (
                    <Image
                      source={cuisine.icon}
                      className="h-10 w-10 object-contain rounded-full"
                      style={{ alignSelf: 'center' }}
                    />
                  ) : (
                    <Text className="text-center">{cuisine.name}</Text>
                  )}
                </Button>
                <Text className="text-xs capitalize">{cuisine.name}</Text>
              </VStack>
            ))}
          </>
        </ScrollView>
      </Box>
            
      <Divider />
      
      <Box className="py-2">
        <Text className="font-medium mb-2">Type de repas</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pb-1"
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
    </>
  ), [selectedCuisine, selectedMealType, handleCuisineSelect, handleMealTypeSelect]);

  // Boutons d'action pour le drawer
  const DrawerActions = useCallback(() => (
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
        disabled={selectedMeals.length === 0 || isSubmitting}
        isDisabled={selectedMeals.length === 0 || isSubmitting}
      >
        <ButtonText>
          {isSubmitting ? 'Ajout en cours...' : `Ajouter ${selectedMeals.length > 0 ? `(${selectedMeals.length})` : ''}`}
        </ButtonText>
      </Button>
    </HStack>
  ), [selectedMeals.length, handleAddMealsToPlan, isSubmitting, setShowMealsDrawer]);

  // Rendu JSX avec le composant générique SelectionDrawer
  return (
    <SelectionDrawer
      title="Sélection de repas"
      showDrawer={showMealsDrawer}
      setShowDrawer={setShowMealsDrawer}
      data={mealsList}
      isLoading={isLoading}
      isPending={isPending}
      isFetchingNextPage={false} // Pas de pagination pour les repas
      isRefetching={isRefetching}
      refetch={refetch}
      fetchNextPage={() => Promise.resolve()} // Fonction vide car pas de pagination
      hasNextPage={false}
      setSearchTerm={handleMealNameSearch}
      renderItem={({ item, index }) => (
        <SimpleMealCard
          key={createStableId(item.id, ItemType.MEAL)}
          item={item}
          index={index}
          isSelected={selectedMeals.some(meal => meal.id === item.id)}
          onToggle={() => handleMealToggle(item)}
          onAdjustQuantity={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
          onMealTypeChange={(type) => handleMealTypeChange(item.id, type)}
          quantity={mealQuantities[item.id] || 100}
          mealType={mealTypes[item.id]}
        />
      )}
      searchPlaceholder="Rechercher un repas..."
      estimatedItemSize={120}
      additionalActions={<FiltersComponent />}
      footerComponent={<DrawerActions />}
    />
  );
}

export default MealsDrawer;
