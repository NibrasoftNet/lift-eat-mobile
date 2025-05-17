import React from 'react';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import { NutritionGoalDefaultValueProps } from '@/utils/validation/plan/nutrition-goal.validation';
import NutritionGoalForm from '@/components/forms/NutritionGoalForm';
import useSessionStore from '@/utils/store/sessionStore';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { UserOrmPros, users } from '@/db/schema';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';

export default function CreateNutritionTarget() {
  const { user } = useSessionStore();
  const drizzleDb = useDrizzleDb();

  const {
    data: actualUser,
    isPending,
    isFetching,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      return drizzleDb.query.users.findFirst({
        where: eq(users.id, Number(user?.id)),
      });
    },
  });

  const nutritionGoalDefaultValueProps: NutritionGoalDefaultValueProps = {
    initialWeight: actualUser?.weight!,
    targetWeight: actualUser?.weight!,
    durationWeeks: 1,
    goalUnit: GoalEnum.MAINTAIN,
  };
  return (
    <QueryStateHandler<UserOrmPros>
      data={actualUser}
      isLoading={isLoading}
      isFetching={isFetching}
      isPending={isPending}
      isRefetching={isRefetching}
    >
      <NutritionGoalForm
        defaultValues={nutritionGoalDefaultValueProps}
        operation="create"
        userId={actualUser?.id || 0}
      />
    </QueryStateHandler>
  );
}
