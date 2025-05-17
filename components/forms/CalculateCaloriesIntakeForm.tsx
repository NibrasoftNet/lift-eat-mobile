import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/ui/card';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageBackground, View } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { useQueryClient } from '@tanstack/react-query';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useRouter } from 'expo-router';
import { HStack } from '@/components/ui/hstack';
import { GetGoalImages } from '@/utils/utils';
import {
  CalculateCaloriesIntakeDefaultValueProps,
  CalculateCaloriesIntakeFormData,
  calculateCaloriesIntakeSchema,
} from '@/utils/validation/plan/calculate-calories-intake.validation';
import GenderFormInput from '@/components/forms-input/GenderFormInput';
import PhysicalActivityFormInput from '@/components/forms-input/PhysicalActivityFormInput';
import { AlertCircleIcon } from 'lucide-react-native';

export default function CalculateCaloriesIntakeForm({
  defaultValues,
}: {
  defaultValues: CalculateCaloriesIntakeDefaultValueProps;
}) {
  const drizzleDb = useDrizzleDb();
  const router = useRouter();

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

  const onSubmit = async (data: CalculateCaloriesIntakeFormData) => {
    console.log('calories', data);
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
              <Input className="my-1">
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
      <GenderFormInput
        defaultGender={defaultValues.gender}
        setValue={setValue}
      />
      {/* Physical activity Selection */}
      <PhysicalActivityFormInput
        defaultPhysicalActivity={defaultValues.physicalActivity}
        setValue={setValue}
      />
      {/* Activity Selection (2x2 Grid) */}
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
          {/*<ButtonSpinner color={Colors.light.icon} />*/}
          <ButtonText>Create</ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
}
