import {
    FormControl,
    FormControlError,
    FormControlErrorText,
    FormControlLabel,
    FormControlLabelText
} from '@/components/ui/form-control';
import { Input, InputField } from "@/components/ui/input"
import { VStack } from '@/components/ui/vstack';
import React, { useState } from 'react';
import {Button, ButtonText} from "@/components/ui/button";
import { Grid, GridItem } from '@/components/ui/grid';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {Card} from "@/components/ui/card";
import {Controller, useForm} from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Enums for scalability
enum WeightUnitEnum {
    KG = 'KG',
    LBS = 'LBS',
    ST = 'ST',
}

enum HeightUnitEnum {
    CM = 'CM',
    IN = 'IN',
    FT = 'FT',
}

enum GoalEnum {
    WEIGHT_LOSS = 'WEIGHT_LOSS',
    MAINTAIN = 'MAINTAIN',
    GAIN_MUSCLE = 'GAIN_MUSCLE',
}

// Zod schema for form validation
const userDetailsSchema = z.object({
    age: z
        .number()
        .min(30)
        .max(200),
    weight: z.number().min(10),
    weightUnit: z.enum([WeightUnitEnum.KG, WeightUnitEnum.LBS, WeightUnitEnum.ST]),
    height: z.number().min(100).max(300),
    heightUnit: z.enum([HeightUnitEnum.CM, HeightUnitEnum.IN, HeightUnitEnum.FT]),
    goal: z.number().default(0),
    goalUnit: z.enum([GoalEnum.GAIN_MUSCLE, GoalEnum.MAINTAIN, GoalEnum.WEIGHT_LOSS]),
});

type FormData = z.infer<typeof userDetailsSchema>;

export default function Details() {
    const [weightUnit, setWeightUnit] = useState<WeightUnitEnum>(WeightUnitEnum.KG); // Default to KG
    const [heightUnit, setHeightUnit] = useState<HeightUnitEnum>(HeightUnitEnum.CM); // Default to CM
    const [goalUnit, setGoalUnit] = useState<GoalEnum>(GoalEnum.MAINTAIN);
    const slidePosition = useSharedValue(0); // Reanimated shared value for position
    const slideHeightPosition = useSharedValue(0); // Reanimated shared value for position
    const slideGoalPosition = useSharedValue(0); // Reanimated shared value for position
    const [buttonWidth, setButtonWidth] = useState(0); // Store dynamic button width


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

    const animatedGoalStyles = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: slideGoalPosition.value }],
            width: buttonWidth, // Dynamic width based on measured button
        };
    });

    const {control, setValue, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(userDetailsSchema),
        defaultValues: {
            age: 20,
            weight: 60,
            weightUnit: WeightUnitEnum.KG,
            height: 160,
            heightUnit: HeightUnitEnum.CM,
            goal: 0,
            goalUnit: GoalEnum.MAINTAIN,
        },
    });

    // Measure the width of the first GridItem
    const handleButtonLayout = (event:any) => {
        const { width } = event.nativeEvent.layout;
        console.log(width)
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

    const handleGoalUnitChange = (unit: GoalEnum, index: number) => {
        setGoalUnit(unit);
        setValue('goalUnit', unit);
        const position = index * (buttonWidth + 7);
        // Animate the blue square to the selected button's position
        slideGoalPosition.value = withTiming(position, { duration: 300 });
    };

    const onSubmit = (data: FormData) => {
        console.log('Validated Data:', data);
    };

    return (
            <VStack space="md" className="w-full max-w-sm mx-auto mt-10">
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
                        {errors.age &&
                            <FormControlError>
                                <FormControlErrorText>{errors.age.message}</FormControlErrorText>
                            </FormControlError>
                        }
                    </FormControl>
                </Card>
                <Card className="rounded-lg flex flex-col gap-2">
                    {/* Height Input */}
                    <FormControl isInvalid={!!errors.weight}>
                        <FormControlLabel>
                            <FormControlLabelText>Weight</FormControlLabelText>
                        </FormControlLabel>
                        <Controller
                            control={control}
                            name="weight"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input className="my-1" size="md">
                                    <InputField
                                        keyboardType="numeric"
                                        placeholder={`Enter you Weight in ${weightUnit}`}
                                        onBlur={onBlur}
                                        onChangeText={(val) => onChange(val ? parseInt(val, 10) : 0)}
                                        value={value.toString()}
                                    />
                                </Input>
                            )}
                        />
                        {errors.weight &&
                            <FormControlError>
                                <FormControlErrorText>{errors.weight.message}</FormControlErrorText>
                            </FormControlError>}
                    </FormControl>

                    {/* Weight Unit Buttons with Sliding Indicator */}
                    <Grid className="w-full h-16 gap-2" _extra={{ className: 'grid-cols-3' }} style={{ position: 'relative' }}>
                        {/* Buttons */}
                        <GridItem
                            _extra={{ className: 'col-span-1' }}
                            className="bg-gray-200 border border-gray-300 rounded-md"
                            onLayout={handleButtonLayout}
                        >
                            <Button
                                onPress={() => handleWidthUnitChange(WeightUnitEnum.KG, 0)}
                                className="w-full h-full bg-transparent"
                            >
                                <ButtonText className='text-gray-500'>
                                    {WeightUnitEnum.KG}
                                </ButtonText>
                            </Button>
                        </GridItem>
                        <GridItem
                            _extra={{ className: 'col-span-1' }}
                            className="bg-gray-200 border border-gray-300 rounded-md"
                        >
                            <Button
                                onPress={() => handleWidthUnitChange(WeightUnitEnum.LBS, 1)}
                                className="w-full h-full bg-transparent"
                            >
                                <ButtonText className='text-gray-500'>
                                    {HeightUnitEnum.CM}
                                </ButtonText>
                            </Button>
                        </GridItem>
                        <GridItem
                            _extra={{ className: 'col-span-1' }}
                            className="bg-gray-200 border border-gray-300 rounded-md"
                        >
                            <Button
                                onPress={() => handleWidthUnitChange(WeightUnitEnum.ST, 2)}
                                className="w-full h-full bg-transparent"
                            >
                                <ButtonText className='text-gray-500'>
                                    {WeightUnitEnum.ST}
                                </ButtonText>
                            </Button>
                        </GridItem>

                        {/* Sliding Blue Square */}
                        <Animated.View
                            className="absolute bottom-0 h-1 bg-blue-500 opacity-50"
                            style={[animatedStyles]}
                        />
                    </Grid>
                </Card>
                <Card className="rounded-lg flex flex-col gap-2">
                    {/* Height Input */}
                    <FormControl isInvalid={!!errors.height}>
                        <FormControlLabel>
                            <FormControlLabelText>Height</FormControlLabelText>
                        </FormControlLabel>
                        <Controller
                            control={control}
                            name="height"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input className="my-1" size="md">
                                    <InputField
                                        keyboardType="numeric"
                                        placeholder={`Enter you goal ${heightUnit}`}
                                        onBlur={onBlur}
                                        onChangeText={(val) => onChange(val ? parseInt(val, 10) : 0)}
                                        value={value.toString()}
                                    />
                                </Input>
                            )}
                        />
                        {errors.height &&
                            <FormControlError>
                                <FormControlErrorText>{errors.height.message}</FormControlErrorText>
                            </FormControlError>}
                    </FormControl>
                    <Grid className="w-full h-16 gap-2" _extra={{ className: 'grid-cols-3' }} style={{ position: 'relative' }}>
                        {/* Buttons */}
                        <GridItem
                            _extra={{ className: 'col-span-1' }}
                            className="bg-gray-200 border border-gray-300 rounded-md"
                            onLayout={handleButtonLayout}
                        >
                            <Button
                                onPress={() => handleHeightUnitChange(HeightUnitEnum.CM, 0)}
                                className="w-full h-full bg-transparent"
                            >
                                <ButtonText className='text-gray-500'>
                                    {HeightUnitEnum.CM}
                                </ButtonText>
                            </Button>
                        </GridItem>
                        <GridItem
                            _extra={{ className: 'col-span-1' }}
                            className="bg-gray-200 border border-gray-300 rounded-md"
                        >
                            <Button
                                onPress={() => handleHeightUnitChange(HeightUnitEnum.IN, 1)}
                                className="w-full h-full bg-transparent"
                            >
                                <ButtonText className='text-gray-500'>
                                    {HeightUnitEnum.IN}
                                </ButtonText>
                            </Button>
                        </GridItem>
                        <GridItem
                            _extra={{ className: 'col-span-1' }}
                            className="bg-gray-200 border border-gray-300 rounded-md"
                        >
                            <Button
                                onPress={() => handleHeightUnitChange(HeightUnitEnum.FT, 2)}
                                className="w-full h-full bg-transparent"
                            >
                                <ButtonText className='text-gray-500'>
                                    {HeightUnitEnum.FT}
                                </ButtonText>
                            </Button>
                        </GridItem>

                        {/* Sliding Blue Square */}
                        <Animated.View
                            className="absolute bottom-0 h-1 bg-blue-500 opacity-50"
                            style={[animatedHeightStyles]}
                        />
                    </Grid>
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
                                <Input className="my-1" size="md" isDisabled={goalUnit === GoalEnum.MAINTAIN}>
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
                        {errors.goal &&
                            <FormControlError>
                                <FormControlErrorText>{errors.goal.message}</FormControlErrorText>
                            </FormControlError>}
                    </FormControl>
                    <Grid className="w-full h-16 gap-2" _extra={{ className: 'grid-cols-3' }} style={{ position: 'relative' }}>
                        {/* Buttons */}
                        <GridItem
                            _extra={{ className: 'col-span-1' }}
                            className="bg-gray-200 border border-gray-300 rounded-md"
                            onLayout={handleButtonLayout}
                        >
                            <Button
                                onPress={() => handleGoalUnitChange(GoalEnum.MAINTAIN, 0)}
                                className="w-full h-full bg-transparent"
                            >
                                <ButtonText className='text-gray-500 text-center'>
                                    Maintain
                                </ButtonText>
                            </Button>
                        </GridItem>
                        <GridItem
                            _extra={{ className: 'col-span-1' }}
                            className="bg-gray-200 border border-gray-300 rounded-md"
                        >
                            <Button
                                onPress={() => handleGoalUnitChange(GoalEnum.WEIGHT_LOSS, 1)}
                                className="w-full h-full bg-transparent"
                            >
                                <ButtonText className='text-gray-500 text-center'>
                                    Lose weight
                                </ButtonText>
                            </Button>
                        </GridItem>
                        <GridItem
                            _extra={{ className: 'col-span-1' }}
                            className="bg-gray-200 border border-gray-300 rounded-md"
                        >
                            <Button
                                onPress={() => handleGoalUnitChange(GoalEnum.GAIN_MUSCLE, 2)}
                                className="w-full h-full bg-transparent"
                            >
                                <ButtonText className='text-gray-500 text-center'>
                                    Gain Muscle
                                </ButtonText>
                            </Button>
                        </GridItem>

                        {/* Sliding Blue Square */}
                        <Animated.View
                            className="absolute bottom-0 h-1 bg-blue-500 opacity-50"
                            style={[animatedGoalStyles]}
                        />
                    </Grid>
                </Card>
                {/* Submit Button */}
                <Button onPress={handleSubmit(onSubmit)} className="bg-blue-500 rounded-md">
                    <ButtonText>Submit</ButtonText>
                </Button>
            </VStack>
    );
}