import React from 'react';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import { NutritionGoalDefaultValueProps } from '@/utils/validation/plan/nutrition-goal.validation';
import NutritionGoalForm from '@/components-new/ui/forms/NutritionGoalForm';
import { UserOrmPros } from '@/db/schema';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { withQueryState } from '@/utils/hoc';
import { useUserQuery } from '@/utils/hooks';
import { userPagesService } from '@/utils/services/pages/user-pages.service';
import { getCurrentUserId } from '@/utils/helpers/userContext';
import { UseQueryResult } from '@tanstack/react-query';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';

// Exporter le composant principal
export default function CreateNutritionTargetScreen() {
  const [userId, setUserId] = React.useState<number | null>(null);

  // Récupérer l'ID utilisateur au chargement du composant
  React.useEffect(() => {
    const fetchUserId = async () => {
      const id = await getCurrentUserId(true);
      setUserId(id);
    };

    fetchUserId();
  }, []);

  // Utiliser le hook personnalisé pour récupérer les détails de l'utilisateur
  const userQuery = useUserQuery<{ details: UserOrmPros }>(
    [DataType.USER, 'details', userId],
    async () => {
      if (!userId) {
        throw new Error('No user ID found in session');
      }

      // Utiliser le service utilisateur pour récupérer les détails
      return userPagesService.getUserProfile(Number(userId));
    },
    {
      enabled: !!userId, // Requête activée uniquement si l'ID utilisateur est disponible
    },
  );

  // Gérer les états de chargement et d'erreur manuellement
  if (userQuery.isLoading || userQuery.isPending) {
    return (
      <VStack className="flex-1 justify-center items-center p-4">
        <Text className="text-center mb-4">
          Chargement des données utilisateur...
        </Text>
      </VStack>
    );
  }

  if (userQuery.error) {
    return (
      <VStack className="flex-1 justify-center items-center p-4">
        <Text className="text-center mb-4">
          Impossible de charger les données utilisateur.
        </Text>
      </VStack>
    );
  }

  // Préparer les valeurs par défaut pour le formulaire
  const nutritionGoalDefaultValueProps: NutritionGoalDefaultValueProps = {
    initialWeight: userQuery.data?.details?.weight || 70,
    targetWeight: userQuery.data?.details?.weight || 70,
    durationWeeks: 1,
    goalUnit: GoalEnum.MAINTAIN,
  };

  return (
    <NutritionGoalForm
      defaultValues={nutritionGoalDefaultValueProps}
      operation="create"
    />
  );
}
