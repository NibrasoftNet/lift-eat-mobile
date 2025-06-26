import React, { useState, useEffect } from 'react';
import { PhysicalActivityEnum } from '@/utils/enum/user-gender-activity.enum';
import { CalculateCaloriesIntakeDefaultValueProps } from '@/utils/validation/plan/calculate-calories-intake.validation';
import CalculateCaloriesIntakeForm from '@/components/forms/CalculateCaloriesIntakeForm';
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

export default function CreateCaloriesCount() {
  const { user } = useSessionStore();
  const drizzleDb = useDrizzleDb();
  const [userId, setUserId] = useState<number | null>(null);

  // Récupérer l'ID utilisateur au chargement du composant
  useEffect(() => {
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
    isRefetching,
  } = useQuery({
    queryKey: [DataType.USER, userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('No user ID found in session');
      }

      logger.info(LogCategory.DATABASE, 'Fetching user data for calories calculation via MCP Server', {
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

  const defaultCalculateCaloriesIntakeValues: CalculateCaloriesIntakeDefaultValueProps =
    {
      age: 20,
      gender: userData?.gender!,
      physicalActivity: PhysicalActivityEnum.LOW,
    };

  return (
    <QueryStateHandler<UserOrmPros>
      data={userData}
      isLoading={isLoading}
      isFetching={false}
      isPending={isPending}
      isRefetching={isRefetching}
    >
      <CalculateCaloriesIntakeForm
        defaultValues={defaultCalculateCaloriesIntakeValues}
      />
    </QueryStateHandler>
  );
}
