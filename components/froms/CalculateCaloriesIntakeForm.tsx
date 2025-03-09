import { VStack } from '@/components/ui/vstack';
import React, { useEffect, useState } from 'react';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Grid, GridItem } from '@/components/ui/grid';
import Animated, {
  FadeInDown,
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const [goalUnit, setGoalUnit] = useState<GoalEnum>(defaultValues.goalUnit);

  // Shared values for animations
  const slideGenderPosition = useSharedValue(0);
  const slideActivityX = useSharedValue(0);
  const slideActivityY = useSharedValue(0);

  const [buttonWidth, setButtonWidth] = useState<number>(0);
  const [buttonHeight, setButtonHeight] = useState<number>(0);

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

  const handleButtonLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    if (width !== buttonWidth) setButtonWidth(width);
    if (height !== buttonHeight) setButtonHeight(height);
  };

  // Animate gender selection
  useEffect(() => {
    if (buttonWidth > 0) {
      slideGenderPosition.value = withTiming(
        genderUnit === GenderEnum.MALE ? 0 : buttonWidth + 7,
        { duration: 300 },
      );
    }
  }, [buttonWidth, genderUnit]);

  // Animate activity selection in 2x2 grid
  useEffect(() => {
    if (buttonWidth > 0 && buttonHeight > 0) {
      const activityOptions = Object.values(PhysicalActivityEnum);
      const index = activityOptions.indexOf(activityUnit);
      const row = Math.floor(index / 2); // Get row (0 or 1)
      const col = index % 2; // Get column (0 or 1)

      slideActivityX.value = withTiming(col * (buttonWidth + 7), {
        duration: 300,
      });
      slideActivityY.value = withTiming(row * (buttonHeight + 7), {
        duration: 300,
      });
    }
  }, [buttonWidth, buttonHeight, activityUnit]);

  const handleGenderUnitChange = (unit: GenderEnum) => {
    setGenderUnit(unit);
    setValue('gender', unit);
  };

  const handleActivityUnitChange = (unit: PhysicalActivityEnum) => {
    setActivityUnit(unit);
    setValue('physicalActivity', unit);
  };

  const handleGoalUnitChange = (unit: GoalEnum) => {
    setGoalUnit(unit);
    setValue('goalUnit', unit);
  };

  const animatedGenderStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: slideGenderPosition.value }],
    width: buttonWidth,
  }));

  const animatedActivityStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: slideActivityX.value },
      { translateY: slideActivityY.value },
    ],
    width: buttonWidth,
    height: 4,
    borderRadius: 5,
  }));

  /* const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: UserGenderActivityFormData) => {
      return await updateUser(drizzleDb, defaultValues.id, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });*/

  const onSubmit = async (data: CalculateCaloriesIntakeFormData) => {
    try {
      // const updatedUser = await mutateAsync(data);
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.SUCCESS}
              title="Success"
              description="Success update profile"
            />
          );
        },
      });
    } catch (error: any) {
      toast.show({
        placement: 'top',
        render: ({ id }: { id: string }) => {
          const toastId = 'toast-' + id;
          return (
            <MultiPurposeToast
              id={toastId}
              color={ToastTypeEnum.ERROR}
              title="Error"
              description={error.toString()}
            />
          );
        },
      });
    }
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
      <Card className="rounded-lg flex flex-col gap-2">
        {/* Goal Input */}
        <FormControl isInvalid={!!errors.goal}>
          <FormControlLabel>
            <FormControlLabelText>Goal</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="goal"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="my-1"
                size="md"
                isDisabled={goalUnit === GoalEnum.MAINTAIN}
              >
                <InputField
                  keyboardType="numeric"
                  placeholder={`Enter you Goal ${goalUnit}`}
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val ? parseInt(val, 10) : 0)}
                  value={value.toString()}
                />
              </Input>
            )}
          />
          {errors.goal && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{errors.goal.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
        <Grid
          className="w-full h-16 gap-2"
          _extra={{ className: 'grid-cols-3' }}
          style={{ position: 'relative' }}
        >
          <GridItem
            _extra={{ className: 'col-span-1' }}
            className="bg-gray-200 border border-gray-300 rounded-md"
          >
            <Button
              onPress={() => handleGoalUnitChange(GoalEnum.MAINTAIN)}
              className={`w-full h-full ${goalUnit === GoalEnum.MAINTAIN ? 'bg-blue-500' : 'bg-transparent'}`}
            >
              <ButtonText
                className={`text-center ${goalUnit === GoalEnum.MAINTAIN ? 'text-white' : 'text-black'}`}
              >
                Maintain
              </ButtonText>
            </Button>
          </GridItem>
          <GridItem
            _extra={{ className: 'col-span-1' }}
            className="bg-gray-200 border border-gray-300 rounded-md"
          >
            <Button
              onPress={() => handleGoalUnitChange(GoalEnum.WEIGHT_LOSS)}
              className={`w-full h-full ${goalUnit === GoalEnum.WEIGHT_LOSS ? 'bg-blue-500' : 'bg-transparent'}`}
            >
              <ButtonText
                className={`text-center ${goalUnit === GoalEnum.WEIGHT_LOSS ? 'text-white' : 'text-black'}`}
              >
                Lose weight
              </ButtonText>
            </Button>
          </GridItem>
          <GridItem
            _extra={{ className: 'col-span-1' }}
            className="bg-gray-200 border border-gray-300 rounded-md"
          >
            <Button
              onPress={() => handleGoalUnitChange(GoalEnum.GAIN_MUSCLE)}
              className={`w-full h-full ${goalUnit === GoalEnum.GAIN_MUSCLE ? 'bg-blue-500' : 'bg-transparent'}`}
            >
              <ButtonText
                className={`text-center ${goalUnit === GoalEnum.GAIN_MUSCLE ? 'text-white' : 'text-black'}`}
              >
                Gain Muscle
              </ButtonText>
            </Button>
          </GridItem>
        </Grid>
      </Card>
      {/* Gender Selection */}
      <Card className="rounded-lg flex flex-col gap-2">
        <Grid
          className="w-full h-16 gap-2"
          _extra={{ className: 'grid-cols-2' }}
          style={{ position: 'relative' }}
        >
          <GridItem
            _extra={{ className: 'col-span-1' }}
            className="bg-gray-200 border border-gray-300 rounded-md"
            onLayout={handleButtonLayout}
          >
            <Button
              onPress={() => handleGenderUnitChange(GenderEnum.MALE)}
              className="w-full h-full bg-transparent"
            >
              <ButtonText className="text-gray-500">
                {GenderEnum.MALE}
              </ButtonText>
            </Button>
          </GridItem>
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
          </GridItem>
          {/* Animated Indicator for Gender Selection */}
          <Animated.View
            className="absolute bottom-0 h-1 bg-blue-500"
            style={[animatedGenderStyles]}
          />
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
              className="bg-gray-200 border border-gray-300 rounded-md"
              onLayout={index === 0 ? handleButtonLayout : undefined}
            >
              <ImageBackground
                source={GetPhysicalActivityImages[activity.level]}
                className="w-full object-cover h-4/6"
                blurRadius={3}
              >
                <Button
                  onPress={() => handleActivityUnitChange(activity.level)}
                  className="flex flex-col items-center justify-center w-full h-24 bg-transparent p-2"
                >
                  <ButtonText className="text-white capitalize">
                    {activity.level}
                  </ButtonText>
                </Button>
              </ImageBackground>
            </GridItem>
          ))}
          {/* Animated Indicator for Activity Selection */}
          <Animated.View
            className="absolute top-0 left-0 bg-blue-500 rounded-md"
            style={[animatedActivityStyles]}
          />
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
