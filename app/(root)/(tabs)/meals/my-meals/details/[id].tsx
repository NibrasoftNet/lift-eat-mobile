import React, { useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { EditIcon, ThreeDotsIcon, Icon, TrashIcon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateCache, DataType } from "@/utils/helpers/queryInvalidation";
import { useToast } from "@/components/ui/toast";
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { getCurrentUserIdSync } from "@/utils/helpers/userContext";
import { withQueryState } from '@/utils/hoc';
import { useMealQuery } from '@/utils/hooks';
import { mealPagesService } from '@/utils/services/pages/meal-pages.service';
import {
  MealWithIngredientAndStandardOrmProps,
  IngredientStandardOrmProps,
  IngredientWithStandardOrmProps
} from '@/db/schema';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { Pressable } from '@/components/ui/pressable';
import {
  CircleChevronLeft,
  HandPlatter,
  Info,
  SoupIcon,
  SquareSigma,
  UtensilsCrossedIcon,
  Weight,
} from 'lucide-react-native';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import IngredientAccordion from '@/components/accordions/IngredientAccordion';
import { Accordion } from '@/components/ui/accordion';
import MacrosInfoCard from '@/components/cards/MacrosInfoCard';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import DeletionModal from '@/components/modals/DeletionModal';

// Interface pour les ingrédients retournés par la méthode MCP
interface MealIngredientDetailProps {
  id: number;
  mealId: number;
  ingredientStandardId: number;
  quantity: number;
  unit: string;
  ingredient: IngredientStandardOrmProps;
}

// Interface pour les données de la page de détail d'un repas
interface MealDetailData {
  meal: MealWithIngredientAndStandardOrmProps;
  ingredients: IngredientWithStandardOrmProps[];
}

// Composant principal qui affiche les détails du repas
function MealDetailsComponent({ data }: { data: MealDetailData }) {
  const { meal, ingredients } = data;
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const toast = useToast();
  const [showModal, setShowModal] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Mutation pour supprimer un repas
  const { mutate: deleteMeal, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const userId = getCurrentUserIdSync();
      if (!userId) {
        throw new Error('Utilisateur non authentifié');
      }
      
      logger.info(LogCategory.DATABASE, `Début de la suppression du repas ${id} pour l'utilisateur ${userId}`);
      
      const result = await mealPagesService.deleteMeal(Number(id));
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Échec de la suppression du repas ${id}`, {
          error: result.error
        });
        throw new Error(result.error || 'Impossible de supprimer ce repas');
      }
      
      return result;
    },
    onSuccess: () => {
      logger.info(LogCategory.DATABASE, `Repas ${id} supprimé avec succès`);
      
      // Invalider le cache
      invalidateCache(queryClient, DataType.MEAL);
      
      // Afficher un toast de confirmation
      toast.show({
        placement: "top",
        render: ({ id: toastId }) => (
          <MultiPurposeToast 
            id={toastId}
            title="Repas supprimé"
            description="Le repas a été supprimé avec succès"
            color={ToastTypeEnum.SUCCESS}
          />
        ),
      });
      
      // Rediriger vers la liste des repas
      router.replace('/meals/my-meals');
    },
    onError: (error) => {
      logger.error(LogCategory.DATABASE, `Erreur lors de la suppression du repas ${id}`, { 
        error: error instanceof Error ? error.message : String(error) 
      });
      
      // Afficher un toast d'erreur
      toast.show({
        placement: "top",
        render: ({ id: toastId }) => (
          <MultiPurposeToast 
            id={toastId}
            title="Erreur"
            description={error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression du repas"}
            color={ToastTypeEnum.ERROR}
          />
        ),
      });
    }
  });

  // Fonction pour gérer la suppression d'un repas
  const handleMealDelete = async () => {
    await deleteMeal();
  };

  if (!meal) {
    return (
      <VStack className="flex-1 justify-center items-center p-4">
        <Text className="text-lg">Aucun repas trouvé</Text>
      </VStack>
    );
  }

  return (
    <VStack className="flex-1 w-full gap-4 p-4">
      <HStack className="w-full h-8 justify-between">
        <Link href="/meals/my-meals" asChild>
          <Pressable>
            <Icon as={CircleChevronLeft} className="w-10 h-10 text-black" />
          </Pressable>
        </Link>
        <Menu
          placement="right top"
          offset={5}
          disabledKeys={['Settings']}
          trigger={({ ...triggerProps }) => (
            <Button
              action="secondary"
              {...triggerProps}
              className="bg-transparent m-0 p-0"
            >
              <ButtonIcon
                as={ThreeDotsIcon}
                className="text-black w-8 h-8"
              />
            </Button>
          )}
        >
          <MenuItem
            key="Edit"
            textValue="Edit"
            onPress={() => router.push(`/meals/my-meals/edit/${id}`)}
          >
            <MenuItemLabel>Modifier</MenuItemLabel>
            <Icon as={EditIcon} className="w-4 h-4 ml-2" />
          </MenuItem>
          <MenuItem
            key="Delete"
            textValue="Delete"
            onPress={() => setShowModal(true)}
          >
            <MenuItemLabel className="text-red-500">Supprimer</MenuItemLabel>
            <Icon as={TrashIcon} className="w-4 h-4 ml-2 text-red-500" />
          </MenuItem>
        </Menu>
      </HStack>

      <ScrollView className="flex-1">
        <Box className="py-2">
          <Card className="p-4 mb-4">
            <HStack className="mb-4 items-center">
              <Avatar>
                <AvatarFallbackText>{meal.name}</AvatarFallbackText>
                {meal.image && typeof meal.image === 'string' && <AvatarImage source={{ uri: meal.image }} />}
              </Avatar>
              <VStack className="ml-3">
                <Text className="text-xl font-semibold">{meal.name}</Text>
                <Text className="text-sm text-gray-500">
                  {`${meal.calories} kcal`}
                </Text>
              </VStack>
            </HStack>

            {meal.description && (
              <VStack className="mb-4">
                <Text className="text-sm font-medium mb-1">Description</Text>
                <Text className="text-sm text-gray-600">{meal.description}</Text>
              </VStack>
            )}

            <Divider className="my-3" />

            <VStack className="gap-2">
              <HStack className="justify-between">
                <HStack className="items-center">
                  <Icon as={UtensilsCrossedIcon} className="w-5 h-5 mr-2" />
                  <Text className="font-medium">Type de repas</Text>
                </HStack>
                <Text>{meal.type || 'Non spécifié'}</Text>
              </HStack>

              <HStack className="justify-between">
                <HStack className="items-center">
                  <Icon as={Weight} className="w-5 h-5 mr-2" />
                  <Text className="font-medium">Portions</Text>
                </HStack>
                <Text>{meal.quantity || 1}</Text>
              </HStack>

              <HStack className="justify-between">
                <HStack className="items-center">
                  <Icon as={SoupIcon} className="w-5 h-5 mr-2" />
                  <Text className="font-medium">Temps de préparation</Text>
                </HStack>
                <Text>Non spécifié</Text>
              </HStack>
            </VStack>
          </Card>

          <MacrosInfoCard
            calories={meal.calories || 0}
            protein={meal.protein || 0}
            carbs={meal.carbs || 0}
            fats={meal.fat || 0}
            unit="g"
          />

          <Card className="p-4 mb-4">
            <HStack className="mb-4 items-center">
              <Icon as={HandPlatter} className="w-6 h-6 mr-2" />
              <Text className="text-lg font-semibold">Ingrédients</Text>
            </HStack>
            <Divider className="mb-4" />
            {ingredients && ingredients.length > 0 ? (
              <Accordion className="w-full">
                {ingredients.map((ingredient, index) => (
                  <IngredientAccordion 
                    key={ingredient.id} 
                    item={ingredient} 
                    index={index} 
                  />
                ))}
              </Accordion>
            ) : (
              <Text className="text-center py-4">Aucun ingrédient disponible</Text>
            )}
          </Card>

          <Card className="p-4 mb-4">
            <HStack className="mb-4 items-center">
              <Icon as={Info} className="w-6 h-6 mr-2" />
              <Text className="text-lg font-semibold">Instructions</Text>
            </HStack>
            <Divider className="mb-4" />
            <Text className="text-sm">{meal.description || 'Aucune instruction disponible'}</Text>
          </Card>
        </Box>
      </ScrollView>

      <DeletionModal
        showModal={showModal}
        setShowModal={setShowModal}
        title="Supprimer le repas"
        description="Êtes-vous sûr de vouloir supprimer ce repas ? Cette action est irréversible."
        handleDelete={handleMealDelete}
        isPending={isDeleting}
      />
    </VStack>
  );
}

// Page principale qui récupère les détails du repas
function MealDetailsPage() {
  const { id } = useLocalSearchParams();
  const mealId = Number(id);

  // Utiliser le hook personnalisé pour récupérer les détails du repas
  const mealQuery = useMealQuery<MealDetailData>(
    [DataType.MEAL, 'details', mealId],
    async () => {
      if (!mealId) {
        throw new Error('ID du repas non fourni');
      }
      
      // Utiliser le service des repas pour récupérer les détails
      return mealPagesService.getMealDetails(mealId);
    },
    {
      enabled: !!mealId,
      retry: 1,
    }
  );

  // S'assurer que nous avons des données valides avant d'afficher le composant
  if (!mealQuery.data) {
    return null; // Sera géré par le HOC withQueryState
  }
  
  return <MealDetailsComponent data={mealQuery.data} />;
}

// Définir l'interface pour les props du composant avec types précis
interface MealDetailsPageProps {
  data: MealDetailData;
}

// Créer le composant enveloppé par withQueryState
const MealDetailsWithState = withQueryState<MealDetailsPageProps, MealDetailData>(MealDetailsPage);

// Exporter le composant principal qui utilise le HOC
export default function MealDetailsScreen() {
  const { id } = useLocalSearchParams();
  const mealId = Number(id);

  // Utiliser le hook personnalisé pour récupérer les détails du repas
  const mealQuery = useMealQuery<MealDetailData>(
    [DataType.MEAL, 'details', mealId],
    async () => {
      if (!mealId) {
        throw new Error('ID du repas non fourni');
      }
      
      // Utiliser le service des repas pour récupérer les détails
      return mealPagesService.getMealDetails(mealId);
    },
    {
      enabled: !!mealId,
      retry: 1,
    }
  );

  return (
    <MealDetailsWithState 
      queryResult={mealQuery}
      loadingMessage="Chargement des détails du repas..."
      errorFallback={
        <VStack className="flex-1 justify-center items-center p-4">
          <Text className="text-center mb-4">Une erreur est survenue lors du chargement du repas.</Text>
          <Link href="/meals/my-meals" asChild>
            <Button action="primary">
              <ButtonText>Retourner aux repas</ButtonText>
            </Button>
          </Link>
        </VStack>
      }
    />
  );
}
