import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { UserOrmPros } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import UserProfileForm from '@/components/froms/UserProfileForm';
import { UserProfileDefaultValuesProps } from '@/utils/validation/user/user-profile.validation';
import { logger } from '@/utils/services/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import sqliteMCPServer from '@/utils/mcp/sqlite-server';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { getCacheConfig } from '@/utils/helpers/cacheConfig';
import useSessionStore from '@/utils/store/sessionStore';

export default function EditUserProfile() {
  const { id } = useLocalSearchParams();
  const drizzleDb = useDrizzleDb();
  const queryClient = useQueryClient();

  const {
    data: actualUser,
    isPending,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: [DataType.USER, id],
    queryFn: async () => {
      logger.info(LogCategory.DATABASE, 'Fetching user profile details via MCP Server', {
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

  const defaultUserDetailsValues: UserProfileDefaultValuesProps = {
    id: Number(actualUser?.id!),
    name: actualUser?.name!,
    email: actualUser?.email!,
    profileImage: actualUser?.profileImage!,
  };

  return (
    <QueryStateHandler<UserOrmPros>
      data={actualUser}
      isLoading={isLoading}
      isFetching={isRefetching}
      isPending={isPending}
      isRefetching={isRefetching}
    >
      <UserProfileForm defaultValues={defaultUserDetailsValues} />
    </QueryStateHandler>
  );
}
