import React from 'react';
import { UserDetailsDefaultValuesProps } from '@/utils/validation/user/user-details.validation';
import UserDetailsForm from '@/components/froms/UserDetailsForm';
import { useLocalSearchParams } from 'expo-router';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useQuery } from '@tanstack/react-query';
import { UserOrmPros } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { getCacheConfig } from '@/utils/helpers/cacheConfig';

export default function EditUserDetails() {
  const { id } = useLocalSearchParams();
  const drizzleDb = useDrizzleDb();

  const {
    data: actualUser,
    isPending,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: [DataType.USER, id],
    queryFn: async () => {
      logger.info(LogCategory.DATABASE, 'Fetching user details for editing via MCP Server', {
        userId: Number(id)
      });
      
      // Utiliser directement le MCP Server pour récupérer les détails de l'utilisateur
      const result = await sqliteMCPServer.getUserDetailsViaMCP(Number(id));
      
      if (!result.success) {
        logger.error(LogCategory.DATABASE, `Failed to get user details: ${result.error}`);
        throw new Error(result.error || `User with ID ${id} not found`);
      }
      
      if (!result.user) {
        logger.warn(LogCategory.DATABASE, `User with ID ${id} not found`);
        throw new Error(`User with ID ${id} not found`);
      }
      
      return result.user;
    },
    ...getCacheConfig(DataType.USER),
  });

  const defaultUserDetailsValues: UserDetailsDefaultValuesProps = {
    id: Number(actualUser?.id!),
    weight: actualUser?.weight!,
    weightUnit: actualUser?.weightUnit!,
    height: actualUser?.height!,
    heightUnit: actualUser?.heightUnit!,
  };

  return (
    <QueryStateHandler<UserOrmPros>
      data={actualUser}
      isLoading={isLoading}
      isFetching={false}
      isPending={isPending}
      isRefetching={isRefetching}
    >
      <UserDetailsForm
        defaultValues={defaultUserDetailsValues}
        operation="update"
      />
    </QueryStateHandler>
  );
}
