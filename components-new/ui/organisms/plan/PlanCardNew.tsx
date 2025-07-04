import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../themeNew';
import { Text } from '../../atoms/base';
import CircularNutritionProgress from '../../molecules/tracking/CircularNutritionProgress';
import Icon from '@/components-new/ui/atoms/display/Icon';
import { Svg, Circle, SvgProps } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useToast } from '@/components-new/ui/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MultiPurposeToast from '@/components-new/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import PlanOptionsDrawer from './PlanOptionsDrawer';
import DeleteConfirmationDrawer from '@/components-new/ui/organisms/DeleteDrawer/DeleteConfirmationDrawer';
import { planPagesService } from '@/utils/services/pages/plan-pages.service';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';
import MenuItemPlan from './MenuItemPlan';


// Inline simple 3-dots icon (horizontal)
const ThreeDotsIcon: React.FC<SvgProps> = (props) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx="4" cy="12" r="2" fill={props.color || '#000'} />
    <Circle cx="12" cy="12" r="2" fill={props.color || '#000'} />
    <Circle cx="20" cy="12" r="2" fill={props.color || '#000'} />
  </Svg>
);


import { PlanOrmProps } from '@/db/schema';

export interface PlanCardNewProps {
  plan: PlanOrmProps;
  onPress?: (plan: PlanOrmProps) => void;
  onMenuPress?: (plan: PlanOrmProps) => void;
}

/**
 * PlanCardNew – nouvelle carte nutrition plan (Figma node 55523-1121)
 * 1. Image header arrondie
 * 2. Menu 3 points en overlay
 * 3. Infos + cercle macros + chips
 */
const PlanCardNew: React.FC<PlanCardNewProps> = ({ plan, onPress, onMenuPress }) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const router = useRouter();
  const toast = useToast();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showOptionDrawer, setShowOptionsDrawer] = useState<boolean>(false);
  const [showActionMenu, setShowActionMenu] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Mutation for deleting a plan
  const { mutateAsync: deleteAsync, isPending: isDeletePending } = useMutation({
    mutationFn: () => planPagesService.deletePlan(plan.id),
    onSuccess: async () => {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title={`Plan deleted`}
              description={`The plan has been successfully deleted`}
            />
          );
        },
      });
      planPagesService.invalidatePlanCache(queryClient, plan.id);
      setShowOptionsDrawer(false);
    },
    onError: (error: any) => {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title={`Cannot Delete Plan`}
              description={error instanceof Error ? error.message : 'An unexpected error occurred'}
            />
          );
        },
      });
    },
  });

  // Mutation to set current plan
  const { mutateAsync: setCurrentAsync } = useMutation({
    mutationFn: () => planPagesService.setCurrentPlan(plan.id),
    onSuccess: async () => {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title={`Plan set as current`}
              description={`"${plan.name}" is now your current plan`}
            />
          );
        },
      });
      planPagesService.invalidatePlanCache(queryClient, plan.id);
      await queryClient.invalidateQueries({ queryKey: ['plans'] });
      await queryClient.invalidateQueries({ queryKey: ['progress', plan.id] });
    },
    onError: (error: any) => {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title={`Failed to set plan as current`}
              description={error.toString()}
            />
          );
        },
      });
    },
  });

  const handlePlanDelete = () => {
    deleteAsync()
      .then(() => setShowModal(false))
      .catch((error) => {
      logger.error(LogCategory.DATABASE, `Error deleting plan: ${error.message}`);
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Erreur de suppression"
              description={(error as Error).message}
            />
          );
        },
      });
    });
  };

  const handleSetCurrentPlan = () => {
    setCurrentAsync().catch((error) => {
      logger.error(LogCategory.DATABASE, `Error setting current plan: ${error.message}`);
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Erreur de configuration"
              description={(error as Error).message}
            />
          );
        },
      });
    });
  };

  const handlePress = () => onPress?.(plan);




  return (
    <>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={handlePress}
        onLongPress={() => setShowOptionsDrawer(true)}
      >
        {/* Menu icon */}
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setShowActionMenu((prev) => !prev)}
          hitSlop={8}
        >
          <Icon as={ThreeDotsIcon} size="sm" color={theme.color('primary')} />
        </TouchableOpacity>

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

        {/* Body */}
        <View style={styles.contentRow}>
          {/* Progress */}
          <CircularNutritionProgress
            calories={plan.calories}
            carbs={plan.carbs}
            protein={plan.protein}
            fat={plan.fat}
            size={90}
            showDetails={true}
            showPercentages={true}
          />
        </View>
        {/* Hide bottom line from inner component */}
        <View style={styles.borderCover} pointerEvents="none" />
      </TouchableOpacity>

        

      {showActionMenu && (
        <MenuItemPlan
          disabledSelect={plan.current}
          onSelectCurrent={() => {
            handleSetCurrentPlan();
            setShowActionMenu(false);
          }}
          onEdit={() => {
            router.push(`/plans/my-plans/edit/${plan.id}`);
            setShowActionMenu(false);
          }}
          onDelete={() => {
            setShowModal(true);
            setShowActionMenu(false);
          }}
          style={{ position: 'absolute', right: theme.space('sm'), top: theme.space('sm') + 32, zIndex: 1000 }}
        />
      )}

    <PlanOptionsDrawer
      visible={showOptionDrawer}
      onClose={() => setShowOptionsDrawer(false)}
      disableEdit={false}
      disableDelete={false}
      onDetail={() => router.push(`/plans/my-plans/details/${plan.id}`)}
      onEdit={() => router.push(`/plans/my-plans/edit/${plan.id}`)}
      onDelete={() => setShowModal(true)}
    />

    <DeleteConfirmationDrawer
       open={showModal}
       onConfirm={handlePlanDelete}
       onCancel={() => setShowModal(false)}
       title="Delete plan"
       description="Are you sure you want to delete this plan? This action cannot be undone."
       isLoading={isDeletePending}
     />
    </>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.color('background'),
      borderRadius: theme.radius('xl'),
      overflow: 'visible',
      position: 'relative',
      shadowColor: '#000000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
/* headerImage removed */
    headerImage: {
      width: '100%',
      height: 110,
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      padding: theme.space('sm'),
    },
    headerImageBorder: {
      borderTopLeftRadius: theme.radius('xl'),
      borderTopRightRadius: theme.radius('xl'),
    },
    menuBtn: {
      position: 'absolute',
      top: theme.space('sm'),
      right: theme.space('sm'),
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: 'rgba(255,255,255,0.8)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentRow: {
      flexDirection: 'row',
      padding: theme.space('lg'),
      alignItems: 'center',
      gap: theme.space('md'),
    },
    infoCol: {
      flex: 1,
    },
    title: {
      fontWeight: '700',
      marginBottom: theme.space('xs'),
    },
    subLine: {
      color: theme.color('blueGrey'),
      marginBottom: theme.space('xs') / 2,
    },
    chipsRow: {
      flexDirection: 'row',
      gap: 6,
      marginTop: 6,
    },
    carbsChip: { backgroundColor: theme.color('overlayOrange') },
    proteinChip: { backgroundColor: theme.color('overlayGreen') },
    fatChip: { backgroundColor: theme.color('overlayBlue') },

    // overlay to hide inner border
    borderCover: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: theme.color('background'),
    },

    // New header styles
    headerSection: {
      alignItems: 'center',
      paddingHorizontal: theme.space('lg'),
      paddingTop: theme.space('lg'),
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: theme.space('md'),
      marginTop: 4,
    },
    durationText: {
      marginLeft: theme.space('lg'),
    },
  });

export default PlanCardNew;