import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import MealSelector from '@/components/selectors/MealSelector';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useQueryClient } from '@tanstack/react-query';

export default function MealSelectorScreen() {
  const { planId, dailyPlanId, day, week } = useLocalSearchParams<{
    planId: string;
    dailyPlanId: string;
    day: string;
    week: string;
  }>();
  const drizzleDb = useDrizzleDb();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleMealsSelected = async () => {
    // Invalider la requête pour rafraîchir les données du plan
    await queryClient.invalidateQueries({ queryKey: [`plan-${planId}`] });
  };

  const handleClose = () => {
    // Navigation explicite vers l'écran des détails du plan
    if (planId) {
      // Utiliser navigation directe à la place de replace pour une meilleure gestion d'historique
      router.navigate({
        pathname: "/(root)/(tabs)/plans/my-plans/details/[id]",
        params: { id: planId }
      });
    }
  };

  return (
    <Box className="flex-1 bg-white">
      <MealSelector
        dailyPlanId={parseInt(dailyPlanId)}
        planId={parseInt(planId)}
        day={day}
        week={parseInt(week)}
        onMealsSelected={handleMealsSelected}
        onClose={handleClose}
      />
    </Box>
  );
}
