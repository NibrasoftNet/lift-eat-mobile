import { VStack } from '@/components/ui/vstack';
import React, { useEffect, useState } from 'react';
import { Button, ButtonText } from "@/components/ui/button";
import { Grid, GridItem } from '@/components/ui/grid';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Card } from "@/components/ui/card";
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from "react-native";
import { bed, worker, hiking, bodyBuilder } from "@/constants/icons";
import { Box } from '@/components/ui/box';
import { Heading } from "@/components/ui/heading";
import {Avatar, AvatarFallbackText, AvatarImage} from "@/components/ui/avatar";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";

// Enums
enum GenderEnum {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}

enum PhysicalActivityEnum {
    LOW = 'LOW',
    SEDENTARY = 'SEDENTARY',
    MODERATE = 'MODERATE',
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
            slideActivityY.value = withTiming(row * (buttonHeight + 35), { duration: 300 });
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

    const activityOptions = [
        {
            level: PhysicalActivityEnum.LOW,
            icon: bed
        },
        {
            level: PhysicalActivityEnum.SEDENTARY,
            icon: worker
        },
        {
            level: PhysicalActivityEnum.MODERATE,
            icon: hiking
        },
        {
            level: PhysicalActivityEnum.HIGH,
            icon: bodyBuilder
        }
    ];

    const onSubmit = (data: FormData) => {
        console.log('Validated Data:', data);
    };

    return (
        <VStack space="md" className="w-full max-w-sm mx-auto mt-10">
            <Card className="p-6 rounded-lg max-w-[360px] m-3">
                <Box className="flex-row">
                    <Avatar className="mr-4">
                        <AvatarFallbackText>JD</AvatarFallbackText>
                        <AvatarImage
                            source={{
                                uri: "https://gluestack.github.io/public-blog-video-assets/camera.png",
                            }}
                        />
                    </Avatar>
                    <VStack>
                        <Heading size="md" className="mb-1">
                            Jane Doe
                        </Heading>
                        <Text size="sm">janedoe@sample.com</Text>
                    </VStack>
                </Box>
                <Box className="my-5 flex flex-row w-full items-center justify-around">
                    <VStack className="items-center sm:flex-1 sm:pb-0 sm:border-r sm:border-outline-300">
                        <Heading size="xs">81</Heading>
                        <Text size="xs">plans</Text>
                    </VStack>
                    <Divider
                        orientation="vertical"
                        className="w-0.5 self-center bg-background-300 flex"
                    />
                    <VStack className="items-center sm:flex-1 sm:py-0 sm:border-r sm:border-outline-300">
                        <Heading size="xs">5,281</Heading>
                        <Text size="xs">day</Text>
                    </VStack>
                    <Divider
                        orientation="vertical"
                        className="w-0.5 self-center bg-background-300 flex"
                    />
                    <VStack className="items-center sm:flex-1 sm:pt-0">
                        <Heading size="xs">+10%</Heading>
                        <Text size="xs">progress</Text>
                    </VStack>
                </Box>
            </Card>
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
                <Grid className="w-full h-52 gap-2" _extra={{ className: 'grid-cols-2' }} style={{ position: 'relative' }}>
                    {activityOptions.map((activity, index) => (
                        <GridItem key={activity.level} _extra={{ className: 'col-span-1' }}
                          className="bg-gray-200 border border-gray-300 rounded-md"
                          onLayout={index === 0 ? handleButtonLayout : undefined}
                        >
                            <Button onPress={() => handleActivityUnitChange(activity.level)} className="flex flex-col items-center justify-center w-full h-24 bg-transparent p-2">
                                <Image
                                    source={activity.icon}
                                    className="w-full h-4/6"
                                    resizeMode="contain"
                                />
                                <ButtonText className='text-gray-500 capitalize'>{activity.level}</ButtonText>
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
