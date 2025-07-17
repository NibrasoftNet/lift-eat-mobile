import React, { useRef } from 'react';
import { ScrollView } from 'react-native';
import CalculateCaloriesIntakeFormNew from '@/components-new/ui/forms/CalculateCaloriesIntakeForm';
import NutritionGoalForm from '@/components-new/ui/forms/NutritionGoalForm';
import { QueryStateHandler } from '@/utils/providers/QueryWrapper';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUserId } from '@/utils/helpers/userContext';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import { userPagesService } from '@/utils/services/pages/user-pages.service';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { DataType } from '@/utils/helpers/queryInvalidation';
import { PhysicalActivityEnum } from '@/utils/enum/user-gender-activity.enum';
import { CalculateCaloriesIntakeDefaultValueProps } from '@/utils/validation/plan/calculate-calories-intake.validation';
import { HeightUnitEnum, GoalEnum } from '@/utils/enum/user-details.enum';
import { NutritionGoalDefaultValueProps } from '@/utils/validation/plan/nutrition-goal.validation';

export interface PlanFormProps {
  mode: 'create' | 'update';
  /** Plan ID is mandatory when mode is "update" */
  planId?: number;
}

/**
 * Unified form component that handles both plan creation and update flows.
 * For now, the update flow only pre-loads the user profile and existing plan data to pre-fill default values.
 * The actual update mutation is delegated to NutritionGoalForm via its `operation` prop.
 */
const PlanForm: React.FC<PlanFormProps> = ({ mode, planId }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [userId, setUserId] = React.useState<number | null>(null);

  React.useEffect(() => {
    (async () => {
      const id = await getCurrentUserId(true);
      setUserId(id);
    })();
  }, []);

  // Fetch user profile (needed for both modes)
  const {
    data: userData,
    isLoading: isLoadingUser,
    isPending: isPendingUser,
    isRefetching: isRefetchingUser,
  } = useQuery({
    queryKey: [DataType.USER, userId],
    queryFn: async () => {
      if (!userId) throw new Error('No user ID');
      logger.info(LogCategory.DATABASE, 'Fetching user data for PlanForm', { userId });
      const result = await userPagesService.getUserProfile(Number(userId));
      if (!result.success || !result.data?.user) throw new Error(result.error || 'User not found');
      return result.data.user;
    },
    enabled: !!userId,
  });

  // Fetch plan details when in update mode
  const {
    data: planData,
    isLoading: isLoadingPlan,
    isPending: isPendingPlan,
    isRefetching: isRefetchingPlan,
  } = useQuery({
    queryKey: [DataType.PLAN, planId],
    queryFn: async () => {
      if (mode === 'update' && planId) {
        const result = await planPagesService.getPlanDetails(planId);
        if (!result.success || !result.data?.plan) throw new Error(result.error || 'Plan not found');
        return result.data.plan;
      }
      return null;
    },
    enabled: mode === 'update' && !!planId,
  });

  // Default values for CalculateCaloriesIntakeFormNew
  const defaultCaloriesValues: CalculateCaloriesIntakeDefaultValueProps = {
    age: 20,
    gender: userData?.gender!,
    physicalActivity: PhysicalActivityEnum.LOW,
    height: userData?.height ?? 170,
    heightUnit: (userData?.heightUnit as HeightUnitEnum) ?? HeightUnitEnum.CM,
  };

  // Default values for NutritionGoalForm
  const defaultNutritionGoal: NutritionGoalDefaultValueProps = {
    // If planData exists (update mode), use its values, otherwise fallback to user profile
    initialWeight: planData?.initialWeight ?? userData?.weight ?? 70,
    targetWeight: planData?.targetWeight ?? userData?.weight ?? 70,
    durationWeeks: planData?.durationWeeks ?? 1,
    goalUnit: (planData?.goalUnit as GoalEnum) ?? GoalEnum.MAINTAIN,
  };

  // Combined loading state
  const isLoading = isLoadingUser || isLoadingPlan;
  const isPending = isPendingUser || isPendingPlan;
  const isRefetching = isRefetchingUser || isRefetchingPlan;

  return (
    <QueryStateHandler
      data={mode === 'update' ? planData : userData}
      isLoading={isLoading}
      isFetching={false}
      isPending={isPending}
      isRefetching={isRefetching}
    >
      <ScrollView ref={scrollRef} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Always render the calorie intake form – updating user preferences can be useful even in update mode */}
        <CalculateCaloriesIntakeFormNew
          defaultValues={defaultCaloriesValues}
          onContinue={() => scrollRef.current?.scrollToEnd({ animated: true })}
        />

        <NutritionGoalForm
          defaultValues={defaultNutritionGoal}
          operation={mode}
          planId={mode === 'update' ? planId : undefined}
        />
      </ScrollView>
    </QueryStateHandler>
  );
};

export default PlanForm;
