import {
    FormControl,
    FormControlError,
    FormControlErrorText,
    FormControlLabel,
    FormControlLabelText
} from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import React, { useState } from 'react';
import { Button, ButtonText } from "@/components/ui/button";
import { Grid, GridItem } from '@/components/ui/grid';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import { Card } from "@/components/ui/card";
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HeightUnitEnum, WeightUnitEnum } from '@/utils/enum/user-details.enum';
import {
    UserDetailsDefaultValuesProps,
    UserDetailsFormData,
    userDetailsSchema
} from "@/utils/validation/user-details.validation";
import RulerPicker from "@/components/ui/ruler-picker/RulerPicker";

export default function UserDetailsForm({defaultValues}: {defaultValues: UserDetailsDefaultValuesProps}) {
    const [weightUnit, setWeightUnit] = useState<WeightUnitEnum>(defaultValues.weightUnit); // Default to KG
    const [heightUnit, setHeightUnit] = useState<HeightUnitEnum>(defaultValues.heightUnit); // Default to CM;
    const slidePosition = useSharedValue(0); // Reanimated shared value for position
    const slideHeightPosition = useSharedValue(0); // Reanimated shared value for position
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

    const { setValue, handleSubmit, formState: { errors } } = useForm<UserDetailsFormData>({
        resolver: zodResolver(userDetailsSchema),
        defaultValues,
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

    const onSubmit = (data: UserDetailsFormData) => {
        console.log('Validated Data:', data);
    };

    return (
        <VStack space="sm" className="w-full mx-auto mt-2">
            <Card className="rounded-lg flex flex-col">
                {/* Height Input */}
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
                        weightTextStyle={{ fontSize: 40, }}
                        centerLineStyle={{ backgroundColor: 'red', height: 80 }}
                        onValueChange={(value) => setValue('weight', value)}
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
                                {WeightUnitEnum.LBS}
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
                        className="absolute bottom-0 h-1 bg-blue-500"
                        style={[animatedStyles]}
                    />
                </Grid>
            </Card>
            <Card className="rounded-lg flex flex-col">
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
                        weightTextStyle={{ fontSize: 40, }}
                        centerLineStyle={{ backgroundColor: 'red', height: 80 }}
                        onValueChange={(value) => setValue('height', value)}
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
                        className="absolute bottom-0 h-1 bg-blue-500"
                        style={[animatedHeightStyles]}
                    />
                </Grid>
            </Card>
            {/* Submit Button */}
            <Button onPress={handleSubmit(onSubmit)} className="bg-blue-500 rounded-md mx-4 mt-8">
                <ButtonText>Submit</ButtonText>
            </Button>
        </VStack>
    );
}