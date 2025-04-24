import React from 'react';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import { NutritionGoalDefaultValueProps } from '@/utils/validation/plan/nutrition-goal.validation';
import NutritionGoalForm from '@/components/froms/NutritionGoalForm';
import useSessionStore from '@/utils/store/sessionStore';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useQuery } from '@tanstack/react-query';
import { UserOrmPros } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { getCurrentUserId } from '@/utils/helpers/userContext';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { getCacheConfig } from '@/utils/helpers/cacheConfig';

export default function CreateNutritionTarget() {
  const { user } = useSessionStore();
  const drizzleDb = useDrizzleDb();
  const [userId, setUserId] = React.useState<number | null>(null);

  // Récupérer l'ID utilisateur au chargement du composant
  React.useEffect(() => {
    const fetchUserId = async () => {
      const id = await getCurrentUserId(true);
      setUserId(id);
    };
    
    fetchUserId();
  }, []);

  const {
    data: userData,
    isPending,
    isLoading,
    isFetching,
    isRefetching,
  } = useQuery({
    queryKey: [DataType.USER, userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('No user ID found in session');
      }
      
      logger.info(LogCategory.DATABASE, 'Fetching user data for nutrition target creation via MCP Server', {
        userId: userId
      });
      
      // Utiliser directement le MCP Server pour récupérer les détails de l'utilisateur
      const result = await sqliteMCPServer.getUserDetailsViaMCP(Number(userId));
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Failed to get user details: ${result.error}`);
        throw new Error(result.error || `User with ID ${userId} not found`);
      }
      
      if (!result.user) {
        logger.warn(LogCategory.DATABASE, `User with ID ${userId} not found`);
        throw new Error(`User with ID ${userId} not found`);
      }
      
      return result.user;
    },
    enabled: !!userId, // Requête activée uniquement si l'ID utilisateur est disponible
    ...getCacheConfig(DataType.USER),
  });

  const nutritionGoalDefaultValueProps: NutritionGoalDefaultValueProps = {
    initialWeight: userData?.weight!,
    targetWeight: userData?.weight!,
    durationWeeks: 1,
    goalUnit: GoalEnum.MAINTAIN,
  };
  return (
    <QueryStateHandler<UserOrmPros>
      data={userData}
      isLoading={isLoading}
      isFetching={isFetching}
      isPending={isPending}
      isRefetching={isRefetching}
    >
      <NutritionGoalForm
        defaultValues={nutritionGoalDefaultValueProps}
        operation="create"
        userId={userData?.id || 0}
      />
    </QueryStateHandler>
  );
}
