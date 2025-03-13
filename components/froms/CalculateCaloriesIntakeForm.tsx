import { VStack } from '@/components/ui/vstack';
import React, { useEffect, useState } from 'react';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Grid, GridItem } from '@/components/ui/grid';
import Animated, {
  FadeInDown, FadeInLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Card } from '@/components/ui/card';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageBackground, View } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  GenderEnum,
  PhysicalActivityEnum,
} from '@/utils/enum/user-gender-activity.enum';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { AlertCircleIcon } from '@/components/ui/icon';
import { useQueryClient } from '@tanstack/react-query';
import MultiPurposeToast from '@/components/MultiPurposeToast';
import { ToastTypeEnum } from '@/utils/enum/general.enum';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'expo-router';
import { HStack } from '@/components/ui/hstack';
import { Colors } from '@/utils/constants/Colors';
import { GetGoalImages, GetPhysicalActivityImages } from '@/utils/utils';
import {
  CalculateCaloriesIntakeDefaultValueProps,
  CalculateCaloriesIntakeFormData,
  calculateCaloriesIntakeSchema,
} from '@/utils/validation/plan/calculate-calories-intake.validation';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import { activityOptions } from '@/utils/constants/constant';

export default function CalculateCaloriesIntakeForm({
  defaultValues,
}: {
  defaultValues: CalculateCaloriesIntakeDefaultValueProps;
}) {
  const drizzleDb = useDrizzleDb();
  const toast = useToast();
  const router = useRouter();

  const [genderUnit, setGenderUnit] = useState<GenderEnum>(
    defaultValues.gender,
  );
  const [activityUnit, setActivityUnit] = useState<PhysicalActivityEnum>(
    defaultValues.physicalActivity,
  );

  // Init Tanstack Query client
  const queryClient = useQueryClient();

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CalculateCaloriesIntakeFormData>({
    resolver: zodResolver(calculateCaloriesIntakeSchema),
    defaultValues,
  });

  const handleGenderUnitChange = (unit: GenderEnum) => {
    setGenderUnit(unit);
    setValue('gender', unit);
  };


  const handleActivityUnitChange = (level: PhysicalActivityEnum) => {
    setActivityUnit(level);
    setValue('physicalActivity', level);
  };

  // Shared values for Male and Female bar widths
  const maleBarWidth = useSharedValue(genderUnit === GenderEnum.MALE ? 100 : 0); // 100% = blue, 0% = gray
  const femaleBarWidth = useSharedValue(
    genderUnit === GenderEnum.FEMALE ? 100 : 0,
  ); // 100% = orange, 0% = gray


  // Animate bar width
  useEffect(() => {
    maleBarWidth.value = withTiming(genderUnit === GenderEnum.MALE ? 100 : 0, {
      duration: 300,
    });
    femaleBarWidth.value = withTiming(
      genderUnit === GenderEnum.FEMALE ? 100 : 0,
      { duration: 300 },
    );
  }, [genderUnit]);


  // Animated style for Male bar
  const maleBarStyles = useAnimatedStyle(() => {
    return {
      width: `${maleBarWidth.value}%`, // Animate width from 0% to 100% or vice versa
      backgroundColor: 'blue', // Blue color for Male bar
    };
  });

  // Animated style for Female bar
  const femaleBarStyles = useAnimatedStyle(() => {
    return {
      width: `${femaleBarWidth.value}%`, // Animate width from 0% to 100% or vice versa
      backgroundColor: 'orange', // Orange color for Female bar
    };
  });

  const onSubmit = async (data: CalculateCaloriesIntakeFormData) => {
    router.push('/plans/my-plans/create/target')
  };

  return (
    <VStack space="md" className="w-full max-w-sm mx-auto mt-2">
      <Animated.View
        entering={FadeInDown.delay(300)}
        className={`rounded-xl h-24 shadow-lg mb-4 overflow-hidden flex items-center justify-center`}
      >
        <ImageBackground
          source={GetGoalImages['GAIN_MUSCLE']}
          className="size-full object-cover"
          blurRadius={10}
        >
          <VStack className={`flex rounded-xl items-center m-4`}>
            <View className={`w-48 rounded-t-xl bg-black py-0.5 px-2`}>
              <Text className={`font-semibold text-center text-white`}>
                Nutrition data
              </Text>
            </View>
            <View className={`w-48 rounded-b-xl bg-gray-200 py-0.5 px-2`}>
              <Text className={`text-gray-600 font-semibold text-center`}>
                Update your data
              </Text>
            </View>
          </VStack>
        </ImageBackground>
      </Animated.View>
      <Card>
        {/* Age Input */}
        <FormControl isInvalid={!!errors.age}>
          <FormControlLabel>
            <FormControlLabelText>Age</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="age"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input className="my-1" size="md">
                <InputField
                  keyboardType="numeric"
                  placeholder="Age"
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val ? parseInt(val, 10) : 0)}
                  value={value.toString()}
                />
              </Input>
            )}
          />
          {errors.age && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.age.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      </Card>
      {/* Gender Selection */}
      <Card className="rounded-lg flex flex-col gap-2">
        <Grid
          className="w-full h-16 gap-2"
          _extra={{ className: 'grid-cols-2' }}
          style={{ position: 'relative' }}
        >
          {/* Male Button */}
          <GridItem
            _extra={{ className: 'col-span-1' }}
            className="bg-gray-200 border border-gray-300 rounded-md"
          >
            <Button
              onPress={() => handleGenderUnitChange(GenderEnum.MALE)}
              className="w-full h-full bg-transparent"
            >
              <ButtonText className="text-gray-500">
                {GenderEnum.MALE}
              </ButtonText>
            </Button>
            {/* Blue animated bar for Male Button */}
            <Animated.View
              className="absolute bottom-0 h-1"
              style={[maleBarStyles, { left: 0 }]} // Animate from left to right
            />
          </GridItem>

          {/* Female Button */}
          <GridItem
            _extra={{ className: 'col-span-1' }}
            className="bg-gray-200 border border-gray-300 rounded-md"
          >
            <Button
              onPress={() => handleGenderUnitChange(GenderEnum.FEMALE)}
              className="w-full h-full bg-transparent"
            >
              <ButtonText className="text-gray-500">
                {GenderEnum.FEMALE}
              </ButtonText>
            </Button>
            {/* Orange animated bar for Female Button */}
            <Animated.View
              className="absolute bottom-0 h-1"
              style={[femaleBarStyles, { right: 0 }]} // Animate from right to left
            />
          </GridItem>
        </Grid>
      </Card>
      {/* Activity Selection (2x2 Grid) */}
      <Card className="rounded-lg flex flex-col gap-2">
        <Grid
          className="w-full h-52 gap-2"
          _extra={{ className: 'grid-cols-2' }}
          style={{ position: 'relative' }}
        >
          {activityOptions.map((activity, index) => (
            <GridItem
              key={activity.level}
              _extra={{ className: 'col-span-1' }}
              className="rounded-md"
            >
              <ImageBackground
                source={GetPhysicalActivityImages[activity.level]}
                className="w-full object-cover h-24"
                blurRadius={3}
              >
                <Animated.View
                  className={`w-full h-1 rounded-md ${activity.level === activityUnit ? "bg-primary-500" : "bg-secondary-500"}`}
                />
                <Button
                  onPress={() => handleActivityUnitChange(activity.level)}
                  className="flex flex-col items-center justify-center w-full h-24 bg-transparent"
                >
                  <ButtonText className="text-white capitalize">
                    {activity.level}
                  </ButtonText>
                </Button>
                {/* Animated Indicator for Activity Selection */}
              </ImageBackground>
            </GridItem>
          ))}
        </Grid>
      </Card>
      <HStack className="w-full justify-between items-center mt-4 gap-2">
        {/* Submit Button */}
        <Button
          className="w-2/5 bg-tertiary-500"
          size="sm"
          onPress={() => router.back()}
        >
          <ButtonText>Cancel</ButtonText>
        </Button>
        {/* Submit Button */}
        <Button className="w-2/5" size="sm" onPress={handleSubmit(onSubmit)}>
          <ButtonSpinner color={Colors.light.icon} />
          <ButtonText>Create</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
}
