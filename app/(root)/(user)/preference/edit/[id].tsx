import React from 'react';
import UserGenderActivityForm from '@/components/froms/UserGenderActivityForm';
import { UserGenderActivityDefaultValueProps } from '@/utils/validation/user/user-gender-activity.validation';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { UserOrmPros } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { getCacheConfig } from '@/utils/helpers/cacheConfig';
import { userPagesService } from '@/utils/services/pages/user-pages.service';

export default function EditUserPreference() {
  const { id } = useLocalSearchParams();

  const {
    data: actualUser,
    isPending,
    isFetching,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: [DataType.USER, id],
    queryFn: async () => {
      logger.info(LogCategory.DATABASE, 'Fetching user preferences for editing via user-pages service', {
        userId: Number(id)
      });
      
      // Utiliser userPagesService pour récupérer le profil utilisateur complet
      const result = await userPagesService.getUserProfile(Number(id));
      
      if (!result.success || !result.data) {
        logger.error(LogCategory.DATABASE, `Failed to get user profile: ${result.error}`);
        throw new Error(result.error || `User with ID ${id} not found`);
      }
      
      // On a besoin des détails pour les préférences
      if (!result.data.details) {
        logger.warn(LogCategory.DATABASE, `Details for user with ID ${id} not found`);
        throw new Error(`Details for user with ID ${id} not found`);
      }
      
      return result.data.details;
    },
    ...getCacheConfig(DataType.USER),
  });

  const defaultGenderActivityValues: UserGenderActivityDefaultValueProps = {
    id: Number(actualUser?.id!),
    age: actualUser?.weight!,
    gender: actualUser?.gender!,
    physicalActivity: actualUser?.physicalActivity!,
    //goal: 0,
    //goalUnit: GoalEnum.MAINTAIN,
  };
  return (
    <QueryStateHandler<UserOrmPros>
      data={actualUser}
      isLoading={isLoading}
      isFetching={isFetching}
      isPending={isPending}
      isRefetching={isRefetching}
    >
      <UserGenderActivityForm
        defaultValues={defaultGenderActivityValues}
        operation="update"
      />
    </QueryStateHandler>
  );
}
