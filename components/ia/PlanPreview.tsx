import React, { useState } from 'react';
import { ViewStyle, ScrollView } from 'react-native';
import { IaPlanType } from '@/utils/validation/ia/ia.schemas';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { ChevronDown } from 'lucide-react-native';
import { GoalEnum } from '@/utils/enum/user-details.enum';

interface PlanPreviewProps {
  plan: IaPlanType;
  style?: ViewStyle;
}

const getGoalColor = (goal: string): string => {
  switch (goal) {
    case GoalEnum.WEIGHT_LOSS:
      return '#F44336';
    case GoalEnum.MAINTAIN:
      return '#2196F3';
    case GoalEnum.GAIN_MUSCLE:
      return '#4CAF50';
    default:
      return '#607D8B';
  }
};

const getGoalIcon = (goal: string): string => {
  switch (goal) {
    case GoalEnum.WEIGHT_LOSS:
      return '⬇️';
    case GoalEnum.MAINTAIN:
      return '⚖️';
    case GoalEnum.GAIN_MUSCLE:
      return '💪';
    default:
      return '🍽️';
  }
};

const PlanPreview: React.FC<PlanPreviewProps> = ({ plan, style }) => {
  // Grouper les repas par jour (dans un plan réel, vous auriez déjà cette structure)
  // Ceci est simplifié pour la démonstration
  const mealsByDay = {
    Lundi: plan.meals?.slice(0, 3) || [],
    Mardi: plan.meals?.slice(0, 3) || [],
    Mercredi: plan.meals?.slice(0, 3) || [],
    Jeudi: plan.meals?.slice(0, 3) || [],
    Vendredi: plan.meals?.slice(0, 3) || [],
    Samedi: plan.meals?.slice(0, 3) || [],
    Dimanche: plan.meals?.slice(0, 3) || [],
  };

  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <Box
      style={[
        {
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: '#ddd',
          flex: 1,
        },
        style,
      ]}
    >
      <VStack space="md">
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{plan.name}</Text>

        <HStack space="sm" style={{ alignItems: 'center', marginBottom: 12 }}>
          <Box
            style={{
              borderRadius: 20,
              paddingVertical: 4,
              paddingHorizontal: 12,
              backgroundColor: getGoalColor(plan.goal),
            }}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
              {getGoalIcon(plan.goal)} {plan.goal}
            </Text>
          </Box>
        </HStack>

        <Box
          style={{
            height: 1,
            backgroundColor: '#e0e0e0',
            marginVertical: 16,
          }}
        />

        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
          Valeurs nutritionnelles quotidiennes
        </Text>

        <HStack
          space="md"
          style={{ justifyContent: 'space-between', marginBottom: 16 }}
        >
          <VStack style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {plan.calories}
            </Text>
            <Text style={{ fontSize: 12, opacity: 0.7 }}>Calories</Text>
          </VStack>
          <VStack style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {plan.carbs}g
            </Text>
            <Text style={{ fontSize: 12, opacity: 0.7 }}>Glucides</Text>
          </VStack>
          <VStack style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {plan.protein}g
            </Text>
            <Text style={{ fontSize: 12, opacity: 0.7 }}>Protéines</Text>
          </VStack>
          <VStack style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {plan.fat}g
            </Text>
            <Text style={{ fontSize: 12, opacity: 0.7 }}>Lipides</Text>
          </VStack>
        </HStack>

        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
          Planning hebdomadaire
        </Text>

        <ScrollView style={{ marginTop: 8 }}>
          <VStack space="sm">
            {Object.entries(mealsByDay).map(([day, dayMeals], index) => (
              <Box
                key={index}
                style={{
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: '#e0e0e0',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <Pressable
                  style={{
                    padding: 12,
                    backgroundColor: '#f5f5f5',
                  }}
                  onPress={() => toggleDay(day)}
                >
                  <HStack
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>
                      {day}
                    </Text>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: [
                          { rotate: expandedDay === day ? '180deg' : '0deg' },
                        ],
                      }}
                    />
                  </HStack>
                </Pressable>

                {expandedDay === day && (
                  <Box style={{ padding: 8 }}>
                    {dayMeals.length > 0 ? (
                      <VStack space="sm">
                        {dayMeals.map((meal, mealIndex) => (
                          <Box
                            key={mealIndex}
                            style={{
                              marginBottom: 10,
                              backgroundColor: '#f9f9f9',
                              borderRadius: 8,
                              padding: 12,
                            }}
                          >
                            <HStack
                              style={{
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <VStack>
                                <Text
                                  style={{ fontSize: 14, fontWeight: '500' }}
                                >
                                  {meal.name}
                                </Text>
                                <Text style={{ fontSize: 12, opacity: 0.7 }}>
                                  {meal.type}
                                </Text>
                              </VStack>
                              <Text
                                style={{ fontSize: 14, fontWeight: 'bold' }}
                              >
                                {meal.calories} cal
                              </Text>
                            </HStack>
                          </Box>
                        ))}
                      </VStack>
                    ) : (
                      <Text
                        style={{
                          fontSize: 14,
                          fontStyle: 'italic',
                          opacity: 0.7,
                          textAlign: 'center',
                          padding: 8,
                        }}
                      >
                        Aucun repas défini pour ce jour
                      </Text>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </VStack>
        </ScrollView>
      </VStack>
    </Box>
  );
};

export default PlanPreview;
