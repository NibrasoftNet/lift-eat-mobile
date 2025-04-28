import React, { useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonIcon } from '@/components/ui/button';
import { EditIcon, ThreeDotsIcon, Icon, TrashIcon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invalidateCache, DataType } from "@/utils/helpers/queryInvalidation";
import { useToast } from "@/components/ui/toast";
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { getCurrentUserIdSync } from "@/utils/helpers/userContext";
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import {
  MealWithIngredientAndStandardOrmProps,
  MealIngredientsOrmProps,
  IngredientStandardOrmProps,
  IngredientWithStandardOrmProps
} from '@/db/schema';

// Interface pour les ingrédients retournés par la méthode MCP
// Adapté au format retourné par handleGetMealDetails
interface MealIngredientDetailProps {
  id: number;
  mealId: number;
  ingredientStandardId: number;
  quantity: number;
  unit: string;
  ingredient: IngredientStandardOrmProps;
}

interface MealDetailPageProps {
  success: boolean;
  meal: MealWithIngredientAndStandardOrmProps;
  ingredients: IngredientWithStandardOrmProps[];
  error?: string;
}

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

export default function MealDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const toast = useToast();
  const drizzleDb = useDrizzleDb();
  const [showModal, setShowModal] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetching,
    isPending,
    isRefetching,
  } = useQuery<MealDetailPageProps>({
    queryKey: [DataType.MEAL, id],
    queryFn: async () => {
      logger.info(LogCategory.DATABASE, `Getting meal ${id} details via MCP Server`);
      
      const result = await sqliteMCPServer.getMealByIdWithIngredientsViaMCP(Number(id));
      
      if (!result.success) {
        throw new Error(result.error || `Failed to get meal ${id} details via MCP Server`);
      }
      
      // Adaptation de la structure des données pour correspondre à ce qu'attend le composant
      const adaptedIngredients = result.ingredients?.map((ing: MealIngredientDetailProps) => ({
        id: ing.id,
        mealId: ing.mealId,
        ingredientStandardId: ing.ingredientStandardId,
        quantity: ing.quantity,
        // Ajout des propriétés requises par IngredientWithStandardOrmProps
        calories: ing.ingredient?.calories || 0,
        carbs: ing.ingredient?.carbs || 0,
        fat: ing.ingredient?.fat || 0,
        protein: ing.ingredient?.protein || 0,
        createdAt: null,
        updatedAt: null,
        unit: ing.unit || 'g',
        ingredientsStandard: ing.ingredient
      })) as IngredientWithStandardOrmProps[] || [];
      
      return {
        success: true,
        meal: result.meal,
        ingredients: adaptedIngredients
      };
    },
  });

  const { mutateAsync, isPending: isDeletionPending } = useMutation({
    mutationFn: async () => {
      logger.info(LogCategory.DATABASE, `Deleting meal ${id} via MCP Server`);
      
      // Récupérer l'ID utilisateur de manière centralisée
      const userId = getCurrentUserIdSync();
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      const result = await sqliteMCPServer.deleteMealViaMCP(Number(id), userId);
      
      if (!result.success) {
        throw new Error(result.error || `Failed to delete meal ${id} via MCP Server`);
      }
      
      return result;
    },
    onSuccess: async () => {
      try {
        // Afficher le toast de succès
        toast.show({
          placement: 'top',
          render: ({ id: toastId }: { id: string }) => {
            const uniqueToastId = 'toast-' + toastId;
            return (
              <MultiPurposeToast
                id={uniqueToastId}
                color={ToastTypeEnum.SUCCESS}
                title={`Meal deleted successfully`}
                description={`The meal has been removed from your collection`}
              />
            );
          },
        });
        
        // Invalider le cache avant la navigation
        await invalidateCache(queryClient, DataType.MEAL, {
          id: Number(id),
          invalidateRelated: true
        });
        
        // Fermer le modal et naviguer uniquement après l'invalidation du cache
        setShowModal(false);
        router.back();
      } catch (error) {
        logger.error(LogCategory.APP, `Error in deletion success handler: ${error}`);
        // Gérer l'erreur sans planter l'application
        toast.show({
          placement: 'top',
          render: ({ id }: { id: string }) => {
            return (
              <MultiPurposeToast
                id={`toast-${id}`}
                color={ToastTypeEnum.ERROR}
                title={`Meal deleted with warning`}
                description={`The meal was deleted but there may be display issues`}
              />
            );
          },
        });
        // Naviguer quand même en cas d'erreur d'invalidation du cache
        setShowModal(false);
        router.back();
      }
    },
    onError: (error: any) => {
      // Show error toast
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title={`Failure delete Meal`}
              description={error.toString()}
            />
          );
        },
      });
    },
  });

  const handleMealDelete = async () => {
    await mutateAsync();
  };

  return (
    <QueryStateHandler<MealWithIngredientAndStandardOrmProps>
      data={data?.meal}
      isLoading={isLoading}
      isFetching={isFetching}
      isPending={isPending}
      isRefetching={isRefetching}
    >
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
            trigger={({ ...triggerProps }) => {
              return (
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
              );
            }}
          >
            <MenuItem
              key="Edit Plan"
              textValue="Edit Plan"
              onPress={() => router.push(`/meals/my-meals/edit/${id}`)}
            >
              <Icon as={EditIcon} size="sm" className="mr-2" />
              <MenuItemLabel size="sm">Edit</MenuItemLabel>
            </MenuItem>
            <MenuItem
              key="Delete Plan"
              textValue="Delete Plan"
              onPress={() => setShowModal(true)}
            >
              <Icon as={TrashIcon} size="sm" className="mr-2" />
              <MenuItemLabel size="sm">Delete</MenuItemLabel>
            </MenuItem>
          </Menu>
        </HStack>
        <Box className="h-44 w-full items-center justify-center">
          <Avatar>
            <AvatarFallbackText>
              {data?.meal?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallbackText>
            {data?.meal?.image ? (
              <AvatarImage
                className="border-2 border-tertiary-500 w-44 h-44 shadow-xl"
                source={{
                  uri: `${data?.meal?.image}`,
                }}
              />
            ) : (
              <AvatarFallbackText>
                <Icon as={HandPlatter} size="lg" className="stroke-white" />
              </AvatarFallbackText>
            )}
          </Avatar>
        </Box>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: 10,
          }}
        >
          <Card className="gap-2">
            <HStack space="sm" className="items-center">
              <Icon as={UtensilsCrossedIcon} className="text-gray-600" />
              <VStack className="flex-1">
                <Text className="font-semibold text-lg">
                  {data?.meal?.name}
                </Text>
                <Text className="text-sm">
                  {data?.meal?.type} • {data?.meal?.cuisine}
                </Text>
              </VStack>
            </HStack>
            <Divider
              orientation="horizontal"
              className={`w-full h-0.5 bg-gray-100`}
            />
            <HStack className="items-center justify-center w-full">
              <HStack className="gap-2 items-center">
                <Icon as={SquareSigma} size="md" />
                <Text>Serving:</Text>
                <Text>{data?.meal?.quantity}</Text>
              </HStack>
              <Divider
                orientation="vertical"
                className={`w-0.5 h-10 bg-gray-100 mx-3`}
              />
              <HStack className="gap-2 items-center">
                <Icon as={Weight} size="md" />
                <Text>Unit:</Text>
                <Text>{data?.meal?.unit}</Text>
              </HStack>
            </HStack>
          </Card>
          <Card className="gap-2">
            <HStack space="sm" className="items-center">
              <Icon as={Info} className="text-gray-600" />
              <Text className="font-semibold text-lg">Preparation</Text>
            </HStack>
            <Divider
              orientation="horizontal"
              className={`w-full h-0.5 bg-gray-100`}
            />
            <Text className="font-semibold text-lg">
              {data?.meal?.description}
            </Text>
          </Card>
          <MacrosInfoCard
            calories={data?.meal?.calories!}
            carbs={data?.meal?.carbs!}
            fats={data?.meal?.fat!}
            protein={data?.meal?.protein!}
            unit="Gr"
          />
          {data?.ingredients?.length === 0 ? (
            <Box className="gap-4 w-full h-full items-center">
              <Icon as={SoupIcon} className="w-16 h-16" />
              <Text>No ingrdients available.</Text>
            </Box>
          ) : (
            <Accordion className="w-full">
              {data?.ingredients?.map((mealIngredient) => (
                <IngredientAccordion
                  key={mealIngredient.id}
                  item={mealIngredient}
                  index={mealIngredient.id}
                />
              ))}
            </Accordion>
          )}
        </ScrollView>
      </VStack>
      <DeletionModal
        title="Delete single meal"
        description="Are you sure you want to delete this meal? This action cannot be undone."
        showModal={showModal}
        setShowModal={setShowModal}
        isPending={isDeletionPending}
        handleDelete={() => handleMealDelete()}
      />
    </QueryStateHandler>
  );
}
