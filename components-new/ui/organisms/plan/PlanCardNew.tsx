import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Text } from '../../atoms/base';
import CircularNutritionProgress from '../../molecules/tracking/CircularNutritionProgress';
import { useRouter } from 'expo-router';
import { useToast } from '@/components-new/ui/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import PlanOptionsDrawer from './PlanOptionsDrawer';
import { PlanOrmProps } from '@/db/schema';
import { DeleteRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/DeleteRegularBoldIcon';

interface PlanCardNewProps {
  plan: PlanOrmProps;
}

/**
 * PlanCardNew – carte d'un plan nutritionnel avec :
 *  • Tap court  : navigation vers détails du plan.
 *  • Appui long : ouvre le PlanOptionsDrawer (detail / edit / delete).
 *  • Swipe-to-delete : glisser vers la gauche pour afficher le bouton « Supprimer ».
 */
const PlanCardNew: React.FC<PlanCardNewProps> = ({ plan }) => {
  /* -------------------------------------------------- */
  /* Hooks & helpers                                     */
  /* -------------------------------------------------- */
  const theme = useAppTheme();
  // Dynamic background: highlight current plan
  const containerBg = plan.current ? theme.color('setCurrentPlan') : theme.color('background');
  const router = useRouter();
  const toast = useToast();
  const swipeableRef = useRef<Swipeable>(null);
  const queryClient = useQueryClient();
  const [showOptionDrawer, setShowOptionsDrawer] = useState(false);

  /* -------------------------------------------------- */
  /* Mutations                                           */
  /* -------------------------------------------------- */
  const { mutateAsync: deleteAsync, isPending: isDeletePending } = useMutation({
    mutationFn: () => planPagesService.deletePlan(plan.id),
    onSuccess: async () => {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <MultiPurposeToast
            id={'toast-' + id}
            color={ToastTypeEnum.SUCCESS}
            title="Plan deleted"
            description="The plan has been successfully deleted"
          />
        ),
      });
      // Remove queries for this plan to avoid stale refetch errors
      queryClient.removeQueries({ queryKey: [`plan-${plan.id}`] });
      queryClient.removeQueries({ queryKey: ['plan-details', plan.id] });
      planPagesService.invalidatePlanCache(queryClient, plan.id);
      await queryClient.invalidateQueries({ queryKey: ['plans'] });
      await queryClient.invalidateQueries({ queryKey: ['plans-list-new'] });
    },
    onError: (error: any) => {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <MultiPurposeToast
            id={'toast-' + id}
            color={ToastTypeEnum.ERROR}
            title="Cannot Delete Plan"
            description={error instanceof Error ? error.message : 'Unexpected error'}
          />
        ),
      });
    },
  });

  /* -------------------------------------------------- */
  /* Mutation: set current                               */
  /* -------------------------------------------------- */
  const { mutateAsync: setCurrentAsync, isPending: isSetCurrentPending } = useMutation({
    mutationFn: () => planPagesService.setCurrentPlan(plan.id),
    onSuccess: async () => {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <MultiPurposeToast
            id={'toast-' + id}
            color={ToastTypeEnum.SUCCESS}
            title="Plan set as current"
            description={`"${plan.name}" is now your current plan`}
          />
        ),
      });
      // Remove queries for this plan to avoid stale refetch errors
      queryClient.removeQueries({ queryKey: [`plan-${plan.id}`] });
      queryClient.removeQueries({ queryKey: ['plan-details', plan.id] });
      planPagesService.invalidatePlanCache(queryClient, plan.id);
      await queryClient.invalidateQueries({ queryKey: ['plans'] });
      await queryClient.invalidateQueries({ queryKey: ['plans-list-new'] });
      await queryClient.invalidateQueries({ queryKey: ['progress', plan.id] });
    },
    onError: (error: any) => {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <MultiPurposeToast
            id={'toast-' + id}
            color={ToastTypeEnum.ERROR}
            title="Failed to set current plan"
            description={error instanceof Error ? error.message : String(error)}
          />
        ),
      });
    },
  });

  /* -------------------------------------------------- */
  /* Handlers                                            */
  /* -------------------------------------------------- */
  const handlePress = () => {
    router.push(`/plans/my-plans/details/${plan.id}`);
  };

  const handleDelete = () => {
    deleteAsync()
      .then(() => swipeableRef.current?.close())
      .catch((error) => {
        logger.error(LogCategory.DATABASE, `Error deleting plan: ${error.message}`);
      });
  };

  const handleSetCurrent = () => {
    setCurrentAsync().catch((error) => {
      logger.error(LogCategory.DATABASE, `Error setting current plan: ${error.message}`);
    });
  };

  /* -------------------------------------------------- */
  /* Swipeable actions                                   */
  /* -------------------------------------------------- */
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, 80],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[styles.deleteButtonContainer, { transform: [{ translateX: trans }] }]}
      >
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton} disabled={isDeletePending}>
          <DeleteRegularBoldIcon width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  /* -------------------------------------------------- */
  /* JSX                                                */
  /* -------------------------------------------------- */
  return (
    <>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
        friction={2}
        rightThreshold={40}
      >
        <TouchableOpacity
          style={[styles.container, { backgroundColor: containerBg } ]}
          activeOpacity={0.8}
          onPress={handlePress}
          onLongPress={() => setShowOptionsDrawer(true)}
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <Text variant="h3" style={styles.title} numberOfLines={2}>
              {plan.name}
            </Text>
            <View style={styles.statsRow}>
              <Text variant="caption" style={styles.subLine}>
                {plan.initialWeight} {plan.unit} → {plan.targetWeight} {plan.unit}
              </Text>
              <Text variant="caption" style={[styles.subLine, styles.durationText]}>
                {plan.durationWeeks} Semaines
              </Text>
            </View>
          </View>

          {/* Progress circle */}
          <View style={styles.contentRow}>
            <CircularNutritionProgress
              calories={plan.calories}
              carbs={plan.carbs}
              protein={plan.protein}
              fat={plan.fat}
              size={90}
              showDetails
              showPercentages
            />
          </View>
        </TouchableOpacity>
      </Swipeable>

      {/* Bottom-sheet options drawer */}
      <PlanOptionsDrawer
        visible={showOptionDrawer}
        onClose={() => setShowOptionsDrawer(false)}
        disableEdit={false}
        disableDelete={false}
        onDetail={() => router.push(`/plans/my-plans/details/${plan.id}`)}
        onEdit={() => router.push({ pathname: '/plans/my-plans/edit/[id]', params: { id: plan.id } })}
        onDelete={handleDelete}
        disableSetCurrent={plan.current}
        onSetCurrent={handleSetCurrent}
      />
    </>
  );
};

/* -------------------------------------------------- */
/* Styles                                              */
/* -------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  headerSection: {
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  durationText: {
    marginLeft: 12,
  },
  title: {
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  subLine: {
    opacity: 0.7,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  /* Swipe-to-delete styles */
  deleteButtonContainer: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF5252',
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
});

export default PlanCardNew;