import React from 'react';
import { UserDetailsDefaultValuesProps } from '@/utils/validation/user/user-details.validation';
import { useLocalSearchParams } from 'expo-router';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useQuery } from '@tanstack/react-query';
import { UserOrmPros, users } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { eq } from 'drizzle-orm';
import UserDetailsForm from '@/components/forms/UserDetailsForm';

export default function EditUserDetails() {
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
      isFetching={isFetching}
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
