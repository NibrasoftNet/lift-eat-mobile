import React from 'react';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Icon } from '../ui/icon';
import { HandPlatter, Minus, Plus } from 'lucide-react-native';
import { IngredientWithStandardOrmProps } from '@/db/schema';
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
  item: IngredientWithStandardOrmProps;
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
                      {item.ingredientsStandard?.name
                        ?.slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallbackText>
                    {item.ingredientsStandard?.image ? (
                      <AvatarImage
                        className="border border-tertiary-500 w-10 h-10"
                        source={{
                          uri: `${item.ingredientsStandard?.image}`,
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
                        {item.ingredientsStandard?.name}
                      </Text>
                      <Text className="text-sm">
                        {item.quantity} {item.ingredientsStandard?.unit} •{' '}
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
            Values per: {item.ingredientsStandard?.quantity}{' '}
            {item.ingredientsStandard?.unit}
          </AccordionContentText>
          <Divider
            orientation="horizontal"
            className={`w-full h-0.5 bg-gray-100 my-1`}
          />
          <MacrosDetailsBox
            carbs={item.ingredientsStandard?.carbs!}
            fats={item.ingredientsStandard?.fat!}
            protein={item.ingredientsStandard?.protein!}
            unit="Gr"
          />
        </VStack>
      </AccordionContent>
    </AccordionItem>
  );
};

export default IngredientAccordion;
