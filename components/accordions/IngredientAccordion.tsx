import React from 'react';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Icon } from '../ui/icon';
import { HandPlatter, Minus, Plus } from 'lucide-react-native';
import { IngredientStandardOrmProps } from '@/db/schema';

// Interface pour les ingrédients retournés par l'API
interface MealIngredientDetailProps {
  id: number;
  mealId: number;
  ingredientStandardId: number;
  quantity: number;
  calories: number;
  ingredient: IngredientStandardOrmProps;
}
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Divider } from '@/components/ui/divider';
import {
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from '../ui/accordion';
import MacrosDetailsBox from '@/components/boxes/MacrosDetailsBox';

const IngredientAccordion: React.FC<{
  item: MealIngredientDetailProps;
  index: number;
}> = ({ item, index }) => {
  return (
    <AccordionItem value={`meal-detail-${index}`} className="rounded-lg">
      <AccordionHeader>
        <AccordionTrigger className="focus:web:rounded-lg">
          {({ isExpanded }) => {
            return (
              <HStack className="w-full justify-between h-12 items-center">
                <HStack className="flex-1 gap-2 items-center">
                  <Avatar>
                    <AvatarFallbackText>
                      {item.ingredient?.name
                        ?.slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallbackText>
                    {item.ingredient?.image ? (
                      <AvatarImage
                        className="border border-tertiary-500 w-10 h-10"
                        source={{
                          uri: `${item.ingredient?.image}`,
                        }}
                      />
                    ) : (
                      <AvatarFallbackText>
                        <Icon
                          as={HandPlatter}
                          size="lg"
                          className="stroke-white"
                        />
                      </AvatarFallbackText>
                    )}
                  </Avatar>
                  <AccordionTitleText>
                    <VStack className="flex-1">
                      <Text className="font-semibold text-sm">
                        {item.ingredient?.name}
                      </Text>
                      <Text className="text-sm">
                        {item.quantity} {item.ingredient?.unit} •{' '}
                        {item.calories} KCal
                      </Text>
                    </VStack>
                  </AccordionTitleText>
                </HStack>
                {isExpanded ? (
                  <AccordionIcon as={Minus} className="mr-3" />
                ) : (
                  <AccordionIcon as={Plus} className="mr-3" />
                )}
              </HStack>
            );
          }}
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent className="w-full">
        <VStack className="flex-1">
          <AccordionContentText className="font-semibold text-sm">
            Values per: {item.ingredient?.quantity}{' '}
            {item.ingredient?.unit}
          </AccordionContentText>
          <Divider
            orientation="horizontal"
            className={`w-full h-0.5 bg-gray-100 my-1`}
          />
          <MacrosDetailsBox
            carbs={item.ingredient?.carbs!}
            fats={item.ingredient?.fat!}
            protein={item.ingredient?.protein!}
            unit="Gr"
          />
        </VStack>
      </AccordionContent>
    </AccordionItem>
  );
};

export default IngredientAccordion;
