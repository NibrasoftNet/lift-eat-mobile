import React from 'react';
import { Pressable } from '../ui/pressable';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Icon } from '../ui/icon';
import { ChevronRight, CalendarDays } from 'lucide-react-native';
import { Text } from '../ui/text';
import { DailyPlanOrmProps, MealOrmProps } from '@/db/schema';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Box } from '../ui/box';
import { DayEnum } from '@/utils/enum/general.enum';
import { useRouter } from 'expo-router';
import NutritionBox from '@/components/boxes/NutritionBox';
import MacrosDetailsBox from '@/components/boxes/MacrosDetailsBox';

interface DailyPlanCardProps {
  dailyPlan: DailyPlanOrmProps & { meals?: MealOrmProps[] };
  index: number;
  onPress?: (dailyPlan: DailyPlanOrmProps & { meals?: MealOrmProps[] }) => void;
  planId: number;
}

const DailyPlanCard: React.FC<DailyPlanCardProps> = ({
  dailyPlan,
  index,
  onPress,
  planId,
}) => {
  const router = useRouter();
  const dayFull = getDayFullName(dailyPlan.day);
  
  const handlePress = () => {
    if (onPress) {
      onPress(dailyPlan);
    } else {
      // Navigation par défaut vers les détails du jour de plan
      router.push({
        pathname: '/(root)/(tabs)/plans/my-plans/details/[id]',
        params: { id: planId.toString(), dayId: dailyPlan.id.toString() }
      });
    }
  };

  const totalMeals = dailyPlan.meals?.length || 0;

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      className="rounded-xl shadow-lg mb-3 overflow-hidden bg-secondary-100 border border-secondary-300"
    >
      <Pressable onPress={handlePress}>
        {({ pressed }) => (
          <VStack
            space="sm"
            className={`p-3 ${pressed ? 'bg-secondary-200' : ''}`}
          >
            <HStack className="w-full justify-between items-center">
              <HStack space="sm" className="items-center">
                <Box className="bg-primary-500 rounded-full p-2">
                  <Icon as={CalendarDays} size="md" className="text-white" />
                </Box>
                <VStack>
                  <Text className="font-semibold text-lg">{dayFull}</Text>
                  <Text className="text-gray-600">Semaine {dailyPlan.week}</Text>
                </VStack>
              </HStack>
              
              <HStack space="sm" className="items-center">
                <NutritionBox
                  title="Cal"
                  value={dailyPlan.calories}
                  unit="KCal"
                  className="w-16 h-12"
                  titleClassName="bg-red-500"
                  valueClassName="bg-red-300"
                />
                <Icon as={ChevronRight} size="sm" className="text-gray-500" />
              </HStack>
            </HStack>
            
            <MacrosDetailsBox
              carbs={dailyPlan.carbs}
              fats={dailyPlan.fat}
              protein={dailyPlan.protein}
              unit="g"
            />
            
            <HStack className="w-full justify-between items-center mt-1">
              <Text className="text-gray-600">
                {totalMeals} {totalMeals > 1 ? 'repas' : 'repas'}
              </Text>
              <Text className="text-primary-500 font-medium">
                {totalMeals > 0 ? 'Voir les repas' : 'Ajouter des repas'}
              </Text>
            </HStack>
          </VStack>
        )}
      </Pressable>
    </Animated.View>
  );
};

// Fonction utilitaire pour obtenir le nom complet du jour
const getDayFullName = (day: DayEnum): string => {
  const dayNames: Record<DayEnum, string> = {
    [DayEnum.MONDAY]: 'Lundi',
    [DayEnum.TUESDAY]: 'Mardi',
    [DayEnum.WEDNESDAY]: 'Mercredi',
    [DayEnum.THURSDAY]: 'Jeudi',
    [DayEnum.FRIDAY]: 'Vendredi',
    [DayEnum.SATURDAY]: 'Samedi',
    [DayEnum.SUNDAY]: 'Dimanche',
  };
  
  return dayNames[day] || day;
};

export default DailyPlanCard;
