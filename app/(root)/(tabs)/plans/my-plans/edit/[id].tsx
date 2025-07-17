import React from 'react';
import { SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import PlanForm from '@/components-new/ui/organisms/plan/PlanForm';
import { useTheme } from '@/themeNew';
import Icon from '@/components-new/ui/atoms/display/Icon';
import ArrowLeft3CurvedBoldIcon from '@/assets/icons/figma/curved-bold/ArrowLeft3CurvedBoldIcon';
import { SvgProps } from 'react-native-svg';
import Button from '@/components-new/ui/atoms/inputs/Button';

export default function EditPlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color('successLighter') }}>


      {id && <PlanForm mode="update" planId={Number(id)} />}
    </SafeAreaView>
  );
}
