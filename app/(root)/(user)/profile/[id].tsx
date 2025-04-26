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
import { DataType } from '@/utils/helpers/queryInvalidation';
import { getCacheConfig } from '@/utils/helpers/cacheConfig';
import useSessionStore from '@/utils/store/sessionStore';
import { userPagesService } from '@/utils/services/pages/user-pages.service';

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
      logger.info(LogCategory.DATABASE, 'Fetching user profile details via user-pages service', {
        userId: Number(id)
      });
      
      // Utiliser le service userPagesService pour récupérer les détails de l'utilisateur
      const result = await userPagesService.getUserProfile(Number(id));
      
      if (!result.success || !result.data) {
        logger.error(LogCategory.DATABASE, `Failed to get user details: ${result.error}`);
        throw new Error(result.error || `User with ID ${id} not found`);
      }
      
      if (!result.data.details) {
        logger.warn(LogCategory.DATABASE, `User details for ID ${id} not found`);
        // Utiliser les données utilisateur de base si les détails ne sont pas disponibles
        return result.data.user; 
      }
      
      return result.data.details;
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
