import React from 'react';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Icon } from '../ui/icon';
import {
  HandPlatter,
  Minus,
  Plus,
} from 'lucide-react-native';
import { IngredientWithStandardProps, MealProps } from '@/db/schema';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
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
import NutritionBox from '@/components/boxes/NutritionBox';



const IngredientCard: React.FC<{ item: IngredientWithStandardProps; index: number }> = ({ item, index }) => {
  return (
    <AccordionItem value="item-1" className="rounded-lg">
      <AccordionHeader>
        <AccordionTrigger className="focus:web:rounded-lg">
          {({ isExpanded }) => {
            return (
              <HStack className='w-full justify-between h-12 items-center'>
                <HStack className='flex-1 gap-2 items-center'>
                  <Avatar>
                    <AvatarFallbackText>
                      {item.ingredientStandard?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallbackText>
                    {item.ingredientStandard?.image ? (
                      <AvatarImage
                        className="border border-tertiary-500 w-10 h-10"
                        source={{
                          uri: `${item.ingredientStandard?.image}`,
                        }}
                      />
                    ) : (
                      <AvatarFallbackText>
                        <Icon as={HandPlatter} size="lg" className="stroke-white" />
                      </AvatarFallbackText>
                    )}
                  </Avatar>
                  <AccordionTitleText>
                    <VStack className="flex-1">
                      <Text
                        className='font-semibold text-sm'
                      >
                        {item.ingredientStandard?.name}
                      </Text>
                      <Text
                        className='text-sm'
                      >
                        {item.quantity} {item.ingredientStandard?.unit} • {item.calories} KCal
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
            )
          }}
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent className="w-full">
        <VStack className="flex-1">
          <AccordionContentText className="font-semibold text-sm"
          >
            Values per: {item.ingredientStandard?.quantity} {item.ingredientStandard?.unit}
          </AccordionContentText>
          <Divider
            orientation="horizontal"
            className={`w-full h-0.5 bg-gray-100 my-1`}
          />
          <HStack className="justify-around pt-3">
            {/* Carbs */}
            <NutritionBox
              title="Carbs"
              value={item.ingredientStandard?.carbs!}
              unit="Gr"
              className="w-24"
              titleClassName="bg-amber-500"
              valueClassName="bg-amber-300"
            />
            {/* Divider between items */}
            <Divider
              orientation="vertical"
              className={`w-0.5 h-14 bg-gray-100 mx-3`}
            />

            {/* Fats */}
            <NutritionBox
              title="Fats"
              value={item.ingredientStandard?.fat!}
              unit="Gr"
              className="w-24"
              titleClassName="bg-green-500"
              valueClassName="bg-green-300"
            />

            {/* Divider between items */}
            <Divider
              orientation="vertical"
              className={`w-0.5 h-14 bg-gray-300 mx-3`}
            />

            {/* Protein */}
            <NutritionBox
              title="Protein"
              value={item.ingredientStandard?.protein!}
              unit="Gr"
              className="w-24"
              titleClassName="bg-blue-500"
              valueClassName="bg-blue-300"
            />
          </HStack>

        </VStack>
      </AccordionContent>
    </AccordionItem>
  );
}

export default IngredientCard
