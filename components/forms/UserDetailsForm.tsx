import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import React, { useState } from 'react';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Card } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HeightUnitEnum, WeightUnitEnum } from '@/utils/enum/user-details.enum';
import {
  UserDetailsDefaultValuesProps,
  UserDetailsFormData,
  userDetailsSchema,
} from '@/utils/validation/user/user-details.validation';
import RulerPicker from '@/components/ui/ruler-picker/RulerPicker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@/utils/services/users.service';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { useRouter } from 'expo-router';
import { Colors } from '@/utils/constants/Colors';
import { HStack } from '@/components/ui/hstack';
import Toast from 'react-native-toast-message';
import { AlertCircleIcon } from 'lucide-react-native';

export default function UserDetailsForm({
  defaultValues,
  operation,
}: {
  defaultValues: UserDetailsDefaultValuesProps;
  operation: 'create' | 'update';
}) {
  const drizzleDb = useDrizzleDb();
  const router = useRouter();
  const [weightUnit, setWeightUnit] = useState<WeightUnitEnum>(
    defaultValues.weightUnit,
  );
  const [heightUnit, setHeightUnit] = useState<HeightUnitEnum>(
    defaultValues.heightUnit,
  );
  const slidePosition = useSharedValue(0); // Reanimated shared value for position
  const slideHeightPosition = useSharedValue(0); // Reanimated shared value for position
  const [buttonWidth, setButtonWidth] = useState(0); // Store dynamic button width

  // Init Tanstack Query client
  const queryClient = useQueryClient();

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slidePosition.value }],
      width: buttonWidth, // Dynamic width based on measured button
    };
  });

  const animatedHeightStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideHeightPosition.value }],
      width: buttonWidth, // Dynamic width based on measured button
    };
  });

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDetailsFormData>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues,
  });

  // Measure the width of the first GridItem
  const handleButtonLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setButtonWidth(width);
  };

  const handleWidthUnitChange = (unit: WeightUnitEnum, index: number) => {
    setWeightUnit(unit);
    setValue('weightUnit', unit);
    const position = index * (buttonWidth + 7);
    // Animate the blue square to the selected button's position
    slidePosition.value = withTiming(position, { duration: 300 }); // Each button is 100px wide
  };

  const handleHeightUnitChange = (unit: HeightUnitEnum, index: number) => {
    setHeightUnit(unit);
    setValue('heightUnit', unit);
    const position = index * (buttonWidth + 7);
    // Animate the blue square to the selected button's position
    slideHeightPosition.value = withTiming(position, { duration: 300 }); // Each button is 100px wide
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: UserDetailsFormData) => {
      return await updateUser(drizzleDb, defaultValues.id, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Success update details 👋',
      });
    },
    onError: (error: any) => {
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `${error.toString()}`,
      });
    },
  });

  const onSubmit = async (data: UserDetailsFormData) => {
    await mutateAsync(data);
  };

  const handleCancel = () => {
    if (operation === 'update') {
      router.back();
    } else {
      router.push('/preference');
    }
  };

  return (
    <VStack space="sm" className="h-full items-center justify-center p-4">
      <Card className="rounded-lg flex flex-col bg-secondary-500">
        {/* Weight Input */}
        <FormControl isInvalid={!!errors.weight}>
          <FormControlLabel>
            <FormControlLabelText>Weight</FormControlLabelText>
          </FormControlLabel>
          <RulerPicker
            initialValue={defaultValues.weight}
            minValue={30}
            maxValue={200}
            step={1}
            unit={weightUnit}
            weightTextStyle={{ fontSize: 40 }}
            centerLineStyle={{ backgroundColor: 'red', height: 80 }}
            onValueChange={(value) => setValue('weight', value)}
          />
          {errors.weight && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors.weight.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
        <HStack className="w-full justify-center gap-2">
          {/* Weight Unit Buttons with Sliding Indicator */}
          <Button
            onPress={() => handleWidthUnitChange(WeightUnitEnum.KG, 0)}
            className={`bg-transparent w-1/4 border border-primary-500`}
          >
            <ButtonText className="text-gray-500">
              {WeightUnitEnum.KG}
            </ButtonText>
          </Button>
          <Button
            onPress={() => handleWidthUnitChange(WeightUnitEnum.LBS, 1)}
            className={`bg-transparent w-1/4 border border-primary-500`}
          >
            <ButtonText className="text-gray-500">
              {WeightUnitEnum.LBS}
            </ButtonText>
          </Button>
          <Button
            onPress={() => handleWidthUnitChange(WeightUnitEnum.ST, 2)}
            className={`bg-transparent w-1/4 border border-primary-500`}
          >
            <ButtonText className="text-gray-500">
              {WeightUnitEnum.ST}
            </ButtonText>
          </Button>
        </HStack>
        {/* Sliding Blue Square */}
        <Animated.View
          className="absolute bottom-0 h-1 bg-blue-500"
          style={[animatedStyles]}
        />
      </Card>
      <Card className="rounded-lg flex flex-col bg-tertiary-100">
        {/* Height Input */}
        <FormControl isInvalid={!!errors.height}>
          <FormControlLabel>
            <FormControlLabelText>Height</FormControlLabelText>
          </FormControlLabel>
          <RulerPicker
            initialValue={defaultValues.height}
            minValue={60}
            maxValue={250}
            step={5}
            unit={heightUnit}
            weightTextStyle={{ fontSize: 40 }}
            centerLineStyle={{ backgroundColor: 'red', height: 80 }}
            onValueChange={(value) => setValue('height', value)}
          />
          {errors.height && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors.height.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
        <HStack className="w-full justify-center gap-2">
          <Button
            onPress={() => handleHeightUnitChange(HeightUnitEnum.CM, 0)}
            className={`bg-transparent w-1/4 border border-primary-500`}
          >
            <ButtonText className="text-gray-500">
              {HeightUnitEnum.CM}
            </ButtonText>
          </Button>
          <Button
            onPress={() => handleHeightUnitChange(HeightUnitEnum.IN, 1)}
            className={`bg-transparent w-1/4 border border-primary-500`}
          >
            <ButtonText className="text-gray-500">
              {HeightUnitEnum.IN}
            </ButtonText>
          </Button>
          <Button
            onPress={() => handleHeightUnitChange(HeightUnitEnum.FT, 2)}
            className={`bg-transparent w-1/4 border border-primary-500`}
          >
            <ButtonText className="text-gray-500">
              {HeightUnitEnum.FT}
            </ButtonText>
          </Button>
        </HStack>
        {/* Sliding Blue Square */}
        <Animated.View
          className="absolute bottom-0 h-1 bg-blue-500"
          style={[animatedHeightStyles]}
        />
      </Card>
      <HStack className="w-full justify-between items-center mt-4 gap-2 px-4">
        {/* Submit Button */}
        <Button
          className="w-2/5 bg-tertiary-500"
          size="sm"
          onPress={handleCancel}
        >
          <ButtonText>{operation === 'create' ? 'Skip' : 'Cancel'}</ButtonText>
        </Button>
        {/* Submit Button */}
        <Button className="w-2/5" size="sm" onPress={handleSubmit(onSubmit)}>
          {isPending ? (
            <ButtonSpinner color={Colors.light.icon} />
          ) : (
            <ButtonText>Update</ButtonText>
          )}
        </Button>
      </HStack>
    </VStack>
  );
}
