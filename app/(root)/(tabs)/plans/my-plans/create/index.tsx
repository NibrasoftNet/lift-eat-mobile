import React from 'react';
import { PhysicalActivityEnum } from '@/utils/enum/user-gender-activity.enum';
import { CalculateCaloriesIntakeDefaultValueProps } from '@/utils/validation/plan/calculate-calories-intake.validation';
import CalculateCaloriesIntakeForm from '@/components/froms/CalculateCaloriesIntakeForm';
import useSessionStore from '@/utils/store/sessionStore';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { UserOrmPros, users } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';

export default function CreateCaloriesCount() {
  const { user } = useSessionStore();
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
        where: eq(users.id, Number(user?.id)),
      });
    },
  });

  const defaultCalculateCaloriesIntakeValues: CalculateCaloriesIntakeDefaultValueProps =
    {
      age: 20,
      gender: actualUser?.gender!,
      physicalActivity: PhysicalActivityEnum.LOW,
    };
  return (
    <QueryStateHandler<UserOrmPros>
      data={actualUser}
      isLoading={isLoading}
      isFetching={isFetching}
      isPending={isPending}
      isRefetching={isRefetching}
    >
      <CalculateCaloriesIntakeForm
        defaultValues={defaultCalculateCaloriesIntakeValues}
      />
    </QueryStateHandler>
  );
}
