import React from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { getMealByIdWithIngredients } from '@/utils/services/meal.service';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { MealWithIngredientAndStandardOrmProps } from '@/db/schema';
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

export default function MealDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const drizzleDb = useDrizzleDb();

  const {
    data: singleMeal,
    isPending,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [`meal-${id}`],
    queryFn: async () =>
      await getMealByIdWithIngredients(drizzleDb, Number(id)),
  });

  return (
    <QueryStateHandler<MealWithIngredientAndStandardOrmProps>
      data={singleMeal}
      isLoading={isLoading}
      isFetching={isFetching}
      isPending={isPending}
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
            <MenuItem key="Delete Plan" textValue="Delete Plan">
              <Icon as={TrashIcon} size="sm" className="mr-2" />
              <MenuItemLabel size="sm">Delete</MenuItemLabel>
            </MenuItem>
          </Menu>
        </HStack>
        <Box className="h-44 w-full items-center justify-center">
          <Avatar>
            <AvatarFallbackText>
              {singleMeal?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallbackText>
            {singleMeal?.image ? (
              <AvatarImage
                className="border-2 border-tertiary-500 w-44 h-44 shadow-xl"
                source={{
                  uri: `${singleMeal?.image}`,
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
                  {singleMeal?.name}
                </Text>
                <Text className="text-sm">
                  {singleMeal?.type} • {singleMeal?.cuisine}
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
                <Text>{singleMeal?.quantity}</Text>
              </HStack>
              <Divider
                orientation="vertical"
                className={`w-0.5 h-10 bg-gray-100 mx-3`}
              />
              <HStack className="gap-2 items-center">
                <Icon as={Weight} size="md" />
                <Text>Unit:</Text>
                <Text>{singleMeal?.unit}</Text>
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
              {singleMeal?.description}
            </Text>
          </Card>
          <MacrosInfoCard
            calories={singleMeal?.calories!}
            carbs={singleMeal?.carbs!}
            fats={singleMeal?.fat!}
            protein={singleMeal?.protein!}
            unit="Gr"
          />
          {singleMeal?.mealIngredients.length === 0 ? (
            <Box className="gap-4 w-full h-full items-center">
              <Icon as={SoupIcon} className="w-16 h-16" />
              <Text>No ingrdients available.</Text>
            </Box>
          ) : (
            <Accordion className="w-full">
              {singleMeal?.mealIngredients.map((mealIngredient, index) => (
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
    </QueryStateHandler>
  );
}
