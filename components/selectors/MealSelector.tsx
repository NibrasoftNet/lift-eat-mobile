import React, { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Pressable } from '../ui/pressable';
import { Input, InputField, InputIcon } from '../ui/input';
import { Icon } from '../ui/icon';
import { Search, Plus, Check } from 'lucide-react-native';
import { MealOrmProps } from '@/db/schema';
import { CuisineTypeEnum, MealTypeEnum } from '@/utils/enum/meal.enum';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { getMealsList } from '@/utils/services/meal.service';
import { useQuery } from '@tanstack/react-query';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { Button } from '../ui/button';
import { useRouter } from 'expo-router';
import { addMealToDailyPlan } from '@/utils/services/plan.service';
import { useToast } from '@/components/ui/toast';
import { Toast, ToastTitle } from '../ui/toast';

interface MealSelectorProps {
  dailyPlanId: number;
  onMealSelected?: (selectedMeals: MealOrmProps[]) => void;
  onClose?: () => void;
  allowMultiple?: boolean;
  planId?: number;
  day?: string;
  week?: number;
  onMealsSelected?: () => Promise<void>;
}

const MealSelector: React.FC<MealSelectorProps> = ({
  dailyPlanId,
  onMealSelected,
  onClose,
  allowMultiple = false,
  planId,
  day,
  week,
  onMealsSelected,
}) => {
  const router = useRouter();
  const drizzleDb = useDrizzleDb();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<MealTypeEnum | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineTypeEnum | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<MealOrmProps[]>([]);

  // Filtres pour les types de repas
  const mealTypes = [
    { value: MealTypeEnum.BREAKFAST, label: 'Petit-déjeuner' },
    { value: MealTypeEnum.LUNCH, label: 'Déjeuner' },
    { value: MealTypeEnum.DINNER, label: 'Dîner' },
    { value: MealTypeEnum.SNACK, label: 'Collation' },
  ];

  // Récupération des repas avec filtrage
  const {
    data: meals,
    isLoading,
    isFetching,
    isPending,
    isRefetching,
  } = useQuery({
    queryKey: ['meals', selectedType, selectedCuisine, searchQuery],
    queryFn: async () => 
      await getMealsList(
        drizzleDb,
        selectedCuisine || undefined,
        selectedType || undefined,
        searchQuery || undefined
      ),
  });

  // Gérer la sélection d'un repas
  const handleMealSelect = (meal: MealOrmProps) => {
    console.log('handleMealSelect called for meal:', meal.name);
    if (allowMultiple) {
      // Mode sélection multiple
      const isAlreadySelected = selectedMeals.some(m => m.id === meal.id);
      
      if (isAlreadySelected) {
        setSelectedMeals(selectedMeals.filter(m => m.id !== meal.id));
      } else {
        setSelectedMeals([...selectedMeals, meal]);
      }
    } else {
      // Mode sélection unique
      setSelectedMeals([meal]);
      
      // Si onMealSelected est fourni, appeler immédiatement
      if (onMealSelected) {
        onMealSelected([meal]);
      }
    }
  };

  // Créer une fonction de navigation vers l'écran de détails du plan
  const navigateBackToPlanDetails = () => {
    if (planId) {
      // Naviguer explicitement vers l'écran de détails du plan
      // Utiliser navigate au lieu de replace pour une meilleure gestion d'historique
      setTimeout(() => {
        router.navigate({
          pathname: "/(root)/(tabs)/plans/my-plans/details/[id]",
          params: { id: planId.toString() }
        });
      }, 300); // Délai légèrement plus long pour s'assurer que toutes les opérations sont terminées
    } else {
      // Si nous ne sommes pas dans le contexte d'un plan, simplement utiliser onClose
      if (onClose) {
        onClose();
      }
    }
  };

  // Ajouter les repas sélectionnés au plan journalier
  const handleSaveMeals = async () => {
    console.log('handleSaveMeals called', { selectedMeals, dailyPlanId, planId });
    if (selectedMeals.length === 0) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast action="error" variant="solid">
              <ToastTitle>Please select at least one meal</ToastTitle>
            </Toast>
          );
        },
      });
      return;
    }

    try {
      // Si on a un planId, on est dans le contexte d'ajout à un plan
      if (planId) {
        // Ajouter chaque repas sélectionné au plan journalier
        for (const meal of selectedMeals) {
          await addMealToDailyPlan(drizzleDb, dailyPlanId, meal.id);
        }
        
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

        // Réinitialiser la sélection
        setSelectedMeals([]);
        
        // Callback pour rafraîchir les données du plan parent
        if (onMealsSelected) {
          await onMealsSelected();
        }
        
        // Utiliser onClose s'il est disponible, sinon naviguer explicitement
        if (onClose) {
          onClose();
        } else {
          // S'assurer de retourner à l'écran précédent après un court délai
          // pour permettre à l'animation du toast de commencer
          setTimeout(() => {
            navigateBackToPlanDetails();
          }, 100);
        }
      } else {
        // Cas où on est simplement en sélection de repas
        if (onMealSelected) {
          onMealSelected(selectedMeals);
        }
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      console.error("Error adding meals:", error);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          return (
            <Toast action="error" variant="solid">
              <ToastTitle>{error instanceof Error ? error.message : "Erreur lors de l'ajout des repas"}</ToastTitle>
            </Toast>
          );
        },
      });
    }
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSelectedType(null);
    setSelectedCuisine(null);
    setSearchQuery('');
  };

  // Rendu d'un élément de repas
  const renderMealItem = ({ item }: { item: MealOrmProps }) => {
    const isSelected = selectedMeals.some(meal => meal.id === item.id);
    
    return (
      <Box 
        className={`p-4 mb-2 rounded-lg border ${
          isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
        }`}
      >
        <Pressable onPress={() => handleMealSelect(item)}>
          <HStack className="justify-between items-center">
            <VStack space="xs">
              <Text className="font-semibold">{item.name}</Text>
              <HStack space="sm">
                <Box className="bg-secondary-100 px-2 py-1 rounded">
                  <Text className="text-xs">{item.type}</Text>
                </Box>
                <Text className="text-gray-500">{item.calories} Kcal</Text>
              </HStack>
            </VStack>
            
            <Pressable 
              onPress={() => handleMealSelect(item)}
              className="z-10"
            >
              {isSelected ? (
                <Box className="bg-primary-500 rounded-full p-2">
                  <Icon as={Check} size="sm" className="text-white" />
                </Box>
              ) : (
                <Box className="bg-gray-200 rounded-full p-2">
                  <Icon as={Plus} size="sm" className="text-gray-600" />
                </Box>
              )}
            </Pressable>
          </HStack>
        </Pressable>
      </Box>
    );
  };

  // Chargement des données
  if (isLoading || isPending) {
    return (
      <QueryStateHandler 
        isLoading={isLoading} 
        isFetching={isFetching} 
        isPending={isPending} 
        isRefetching={isRefetching} 
        data={meals || []} 
      >
        <></>
      </QueryStateHandler>
    );
  }

  return (
    <VStack className="flex-1 p-4">
      <HStack className="justify-between items-center mb-4">
        <Text className="text-xl font-bold">Sélectionner des repas</Text>
        {allowMultiple && (
          <Text className="text-primary-500">
            {selectedMeals.length} sélectionné(s)
          </Text>
        )}
      </HStack>

      {/* Barre de recherche */}
      <Box className="mb-4">
        <Input
          className="bg-white border-gray-300 rounded-lg"
        >
          <InputIcon as={Search} className="ml-3 text-gray-400" />
          <InputField
            placeholder="Rechercher un repas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Input>
      </Box>

      {/* Filtres de type de repas */}
      <HStack className="mb-4 flex-wrap">
        {mealTypes.map((type) => (
          <Pressable
            key={type.value}
            onPress={() => setSelectedType(
              selectedType === type.value ? null : type.value
            )}
            className="mr-2 mb-2"
          >
            <Box
              className={`px-3 py-1 rounded-full ${
                selectedType === type.value
                  ? 'bg-primary-500'
                  : 'bg-gray-200'
              }`}
            >
              <Text
                className={`${
                  selectedType === type.value ? 'text-white' : 'text-gray-700'
                }`}
              >
                {type.label}
              </Text>
            </Box>
          </Pressable>
        ))}
        
        {(selectedType || selectedCuisine) && (
          <Pressable
            onPress={handleResetFilters}
            className="mr-2 mb-2"
          >
            <Box className="bg-red-100 px-3 py-1 rounded-full">
              <Text className="text-red-700">Réinitialiser</Text>
            </Box>
          </Pressable>
        )}
      </HStack>

      {/* Liste des repas */}
      {(meals && meals.length > 0) ? (
        <Box className="flex-1">
          <FlashList
            data={meals}
            renderItem={renderMealItem}
            estimatedItemSize={80}
            contentContainerClassName="pb-4"
            keyExtractor={(item) => item.id.toString()}
          />
        </Box>
      ) : (
        <VStack className="flex-1 justify-center items-center">
          <Text className="text-gray-500">
            Aucun repas trouvé. Ajustez vos filtres ou créez un nouveau repas.
          </Text>
          <Button
            className="mt-4 bg-primary-500"
            onPress={() => router.push('/(root)/(tabs)/meals/my-meals/create')}
          >
            <Text className="text-white">Créer un repas</Text>
          </Button>
        </VStack>
      )}

      {/* Boutons Annuler et Retour */}
      <HStack space="md" className="mt-4">
        <Button
          className="flex-1 bg-gray-300"
          onPress={() => {
            // Annuler la sélection et fermer
            setSelectedMeals([]);
            if (onClose) {
              onClose();
            } else {
              navigateBackToPlanDetails();
            }
          }}
        >
          <Text className="text-gray-700">Annuler</Text>
        </Button>
        <Button
          className="flex-1 bg-gray-500"
          onPress={() => {
            // Simplement retourner à l'écran précédent
            navigateBackToPlanDetails();
          }}
        >
          <Text className="text-white">Retour</Text>
        </Button>
      </HStack>

      {/* Bouton de confirmation pour la sélection multiple */}
      {(allowMultiple || planId) && (
        <Button
          className="mt-4 bg-primary-500"
          onPress={handleSaveMeals}
          disabled={selectedMeals.length === 0}
        >
          <Text className="text-white">
            Add {selectedMeals.length > 0 ? selectedMeals.length : ''} meal{selectedMeals.length !== 1 ? 's' : ''} to plan
          </Text>
        </Button>
      )}
    </VStack>
  );
};

export default MealSelector;
