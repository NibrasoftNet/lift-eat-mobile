import React from 'react';
import { ViewStyle } from 'react-native';
import { IaMealType } from '@/utils/validation/ia/ia.schemas';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { MealTypeEnum } from '@/utils/enum/meal.enum';
import { CuisineTypeEnum } from '@/utils/enum/meal.enum';

interface MealPreviewProps {
  meal: IaMealType;
  style?: ViewStyle;
}

const getTypeColor = (type: string): string => {
  switch (type) {
    case MealTypeEnum.BREAKFAST:
      return '#FF9800';
    case MealTypeEnum.LUNCH:
      return '#2196F3';
    case MealTypeEnum.DINNER:
      return '#673AB7';
    case MealTypeEnum.SNACK:
      return '#4CAF50';
    default:
      return '#607D8B';
  }
};

const getCuisineIcon = (cuisine: string): string => {
  switch (cuisine) {
    case CuisineTypeEnum.ITALIAN:
      return '🇮🇹';
    case CuisineTypeEnum.FRENCH:
      return '🇫🇷';
    case CuisineTypeEnum.MEXICAN:
      return '🇲🇽';
    case CuisineTypeEnum.TUNISIAN:
      return '🇹🇳';
    case CuisineTypeEnum.INDIAN:
      return '🇮🇳';
    case CuisineTypeEnum.CHINESE:
      return '🇨🇳';
    case CuisineTypeEnum.JAPANESE:
      return '🇯🇵';
    case 'ALGERIAN':
      return '🇩🇿';
    case CuisineTypeEnum.AMERICAN:
      return '🇺🇸';
    case CuisineTypeEnum.ASIAN:
      return '🍜';
    default:
      return '🍽️';
  }
};

const MealPreview: React.FC<MealPreviewProps> = ({ meal, style }) => {
  // Calculer le total des valeurs nutritionnelles
  const totalCalories = meal.calories || 0;
  const totalCarbs = meal.carbs || 0;
  const totalProtein = meal.protein || 0;
  const totalFat = meal.fat || 0;

  return (
    <Box
      style={[
        {
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: '#ddd',
        },
        style,
      ]}
    >
      <VStack space="md">
        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 8,
          }}
        >
          {meal.name}
        </Text>

        <HStack
          style={{
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Box
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 50,
              marginRight: 8,
              backgroundColor: getTypeColor(meal.type),
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 12,
                fontWeight: '500',
              }}
            >
              {meal.type}
            </Text>
          </Box>

          <Text>
            {getCuisineIcon(meal.cuisine)} {meal.cuisine}
          </Text>
        </HStack>

        {meal.description && (
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              marginTop: 8,
              opacity: 0.8,
            }}
          >
            {meal.description}
          </Text>
        )}

        <Box
          style={{
            height: 1,
            backgroundColor: '#ddd',
            marginVertical: 16,
          }}
        />

        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 12,
          }}
        >
          Valeurs nutritionnelles
        </Text>

        <HStack
          style={{
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <VStack style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {totalCalories}
            </Text>
            <Text style={{ fontSize: 12, opacity: 0.7 }}>Calories</Text>
          </VStack>
          <VStack style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {totalCarbs}g
            </Text>
            <Text style={{ fontSize: 12, opacity: 0.7 }}>Glucides</Text>
          </VStack>
          <VStack style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {totalProtein}g
            </Text>
            <Text style={{ fontSize: 12, opacity: 0.7 }}>Protéines</Text>
          </VStack>
          <VStack style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {totalFat}g
            </Text>
            <Text style={{ fontSize: 12, opacity: 0.7 }}>Lipides</Text>
          </VStack>
        </HStack>

        {meal.ingredients && meal.ingredients.length > 0 && (
          <>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 12,
              }}
            >
              Ingrédients
            </Text>

            <Box
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginHorizontal: -4,
              }}
            >
              {meal.ingredients.map((ingredient, index) => (
                <Box
                  key={index}
                  style={{
                    width: '48%',
                    marginHorizontal: '1%',
                    marginBottom: 10,
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                    }}
                  >
                    {ingredient.name}
                  </Text>

                  <HStack
                    style={{
                      justifyContent: 'space-between',
                      marginTop: 4,
                    }}
                  >
                    <Text style={{ fontSize: 12, opacity: 0.7 }}>
                      {ingredient.quantity || 0} {ingredient.unit}
                    </Text>
                    <Text style={{ fontSize: 12, opacity: 0.7 }}>
                      {ingredient.calories || 0} cal
                    </Text>
                  </HStack>
                </Box>
              ))}
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default MealPreview;
