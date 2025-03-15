import React from 'react';
import UserGenderActivityForm from '../../../../../components/froms/UserGenderActivityForm';
import { UserGenderActivityDefaultValueProps } from '@/utils/validation/user/user-gender-activity.validation';
import { useLocalSearchParams } from 'expo-router';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { UserOrmPros, users } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';

export default function EditUserPreference() {
  const { id } = useLocalSearchParams();
  const drizzleDb = useDrizzleDb();

  const {
    data: actualUser,
    isPending,
    isFetching,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      return drizzleDb.query.users.findFirst({
        where: eq(users.id, Number(id)),
      });
    },
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
