import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { UserOrmPros, users } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { UserProfileDefaultValuesProps } from '@/utils/validation/user/user-profile.validation';
import UserProfileForm from '@/components/froms/UserProfileForm';

export default function EditUserProfile() {
  const { id } = useLocalSearchParams();
  const drizzleDb = useDrizzleDb();

  const {
    data: actualUser,
    isPending,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      return drizzleDb.query.users.findFirst({
        where: eq(users.id, Number(id)),
      });
    },
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
      isFetching={isFetching}
      isPending={isPending}
    >
      <UserProfileForm defaultValues={defaultUserDetailsValues} />
    </QueryStateHandler>
  );
}
