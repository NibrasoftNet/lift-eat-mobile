import React from 'react';
import { UserDetailsDefaultValuesProps } from '@/utils/validation/user/user-details.validation';
import UserDetailsForm from '@/components/froms/UserDetailsForm';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { UserOrmPros } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { getCacheConfig } from '@/utils/helpers/cacheConfig';
import { userPagesService } from '@/utils/services/pages/user-pages.service';

export default function EditUserDetails() {
  const { id } = useLocalSearchParams();

  const {
    data: actualUser,
    isPending,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: [DataType.USER, id],
    queryFn: async () => {
      logger.info(LogCategory.DATABASE, 'Fetching user details for editing via user-pages service', {
        userId: Number(id)
      });
      
      // Utiliser le service userPagesService pour récupérer les détails de l'utilisateur
      const result = await userPagesService.getUserProfile(Number(id));
      
      if (!result.success || !result.data) {
        logger.error(LogCategory.DATABASE, `Failed to get user details: ${result.error}`);
        throw new Error(result.error || `User with ID ${id} not found`);
      }
      
      if (!result.data.details) {
        logger.warn(LogCategory.DATABASE, `Details for user with ID ${id} not found`);
        throw new Error(`Details for user with ID ${id} not found`);
      }
      
      return result.data.details;
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
