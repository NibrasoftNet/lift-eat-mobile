import { VStack } from '@/components/ui/vstack';
import React, { useEffect, useState } from 'react';
import { Button, ButtonText } from "@/components/ui/button";
import { Grid, GridItem } from '@/components/ui/grid';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Card } from "@/components/ui/card";
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Enums
enum GenderEnum {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}

enum PhysicalActivityEnum {
    SEDENTARY = 'SEDENTARY',
    MODERATE = 'MODERATE',
    LOW = 'LOW',
    HIGH = 'HIGH',
}

// Form validation schema
const userPreferenceSchema = z.object({
    gender: z.enum([GenderEnum.MALE, GenderEnum.FEMALE]),
    physicalActivity: z.enum([PhysicalActivityEnum.LOW, PhysicalActivityEnum.HIGH, PhysicalActivityEnum.MODERATE, PhysicalActivityEnum.SEDENTARY]),
});

type FormData = z.infer<typeof userPreferenceSchema>;

export default function Preference() {
    const [genderUnit, setGenderUnit] = useState<GenderEnum>(GenderEnum.MALE);
    const [activityUnit, setActivityUnit] = useState<PhysicalActivityEnum>(PhysicalActivityEnum.LOW);

    // Shared values for animations
    const slideGenderPosition = useSharedValue(0);
    const slideActivityX = useSharedValue(0);
    const slideActivityY = useSharedValue(0);

    const [buttonWidth, setButtonWidth] = useState(0);
    const [buttonHeight, setButtonHeight] = useState(0);

    const { setValue, handleSubmit } = useForm<FormData>({
        resolver: zodResolver(userPreferenceSchema),
        defaultValues: {
            gender: GenderEnum.MALE,
            physicalActivity: PhysicalActivityEnum.LOW,
        },
    });

    const handleButtonLayout = (event: any) => {
        const { width, height } = event.nativeEvent.layout;
        if (width !== buttonWidth) setButtonWidth(width);
        if (height !== buttonHeight) setButtonHeight(height);
    };

    // Animate gender selection
    useEffect(() => {
        if (buttonWidth > 0) {
            slideGenderPosition.value = withTiming(genderUnit === GenderEnum.MALE ? 0 : buttonWidth + 7, { duration: 300 });
        }
    }, [buttonWidth, genderUnit]);

    // Animate activity selection in 2x2 grid
    useEffect(() => {
        if (buttonWidth > 0 && buttonHeight > 0) {
            const activityOptions = Object.values(PhysicalActivityEnum);
            const index = activityOptions.indexOf(activityUnit);
            const row = Math.floor(index / 2);  // Get row (0 or 1)
            const col = index % 2;              // Get column (0 or 1)

            slideActivityX.value = withTiming(col * (buttonWidth + 7), { duration: 300 });
            slideActivityY.value = withTiming(row * (buttonHeight + 7), { duration: 300 });
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

    const animatedGenderStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: slideGenderPosition.value }],
        width: buttonWidth,
    }));

    const animatedActivityStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: slideActivityX.value }, { translateY: slideActivityY.value }],
        width: buttonWidth,
        height: 4,
        borderRadius : 5
    }));

    const activityOptions = Object.values(PhysicalActivityEnum);

    const onSubmit = (data: FormData) => {
        console.log('Validated Data:', data);
    };

    return (
        <VStack space="md" className="w-full max-w-sm mx-auto mt-10">
            {/* Gender Selection */}
            <Card className="rounded-lg flex flex-col gap-2">
                <Grid className="w-full h-16 gap-2" _extra={{ className: 'grid-cols-2' }} style={{ position: 'relative' }}>
                    <GridItem _extra={{ className: 'col-span-1' }} className="bg-gray-200 border border-gray-300 rounded-md" onLayout={handleButtonLayout}>
                        <Button onPress={() => handleGenderUnitChange(GenderEnum.MALE)} className="w-full h-full bg-transparent">
                            <ButtonText className='text-gray-500'>{GenderEnum.MALE}</ButtonText>
                        </Button>
                    </GridItem>
                    <GridItem _extra={{ className: 'col-span-1' }} className="bg-gray-200 border border-gray-300 rounded-md">
                        <Button onPress={() => handleGenderUnitChange(GenderEnum.FEMALE)} className="w-full h-full bg-transparent">
                            <ButtonText className='text-gray-500'>{GenderEnum.FEMALE}</ButtonText>
                        </Button>
                    </GridItem>
                    {/* Animated Indicator for Gender Selection */}
                    <Animated.View className="absolute bottom-0 h-1 bg-blue-500" style={[animatedGenderStyles]} />
                </Grid>
            </Card>
            {/* Activity Selection (2x2 Grid) */}
            <Card className="rounded-lg flex flex-col gap-2">
                <Grid className="w-full h-36 gap-2" _extra={{ className: 'grid-cols-2' }} style={{ position: 'relative' }}>
                    {activityOptions.map((activity, index) => (
                        <GridItem key={activity} _extra={{ className: 'col-span-1' }}
                                  className="bg-gray-200 border border-gray-300 rounded-md"
                                  onLayout={index === 0 ? handleButtonLayout : undefined}
                        >
                            <Button onPress={() => handleActivityUnitChange(activity)} className="w-full h-16 bg-transparent">
                                <ButtonText className='text-gray-500'>{activity}</ButtonText>
                            </Button>
                        </GridItem>
                    ))}
                    {/* Animated Indicator for Activity Selection */}
                    <Animated.View className="absolute top-0 left-0 bg-blue-500 rounded-md" style={[animatedActivityStyles]} />
                </Grid>
            </Card>
            {/* Submit Button Now Correctly Positioned */}
            <Button onPress={handleSubmit(onSubmit)} className="bg-blue-500 rounded-md">
                <ButtonText>Submit</ButtonText>
            </Button>
        </VStack>
    );
}
