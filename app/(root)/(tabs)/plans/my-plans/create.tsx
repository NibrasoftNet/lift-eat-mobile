import React, { useState } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Checkbox } from '@/components/ui/checkbox';
import { GoalEnum, WeightUnitEnum } from '@/utils/enum/user-details.enum';
import { router } from 'expo-router';

const primaryColor = '#3b82f6';
const backgroundImage = require('@/assets/images/plant/CreatePlant.jpg');

interface CreatePlanData {
    name: string;
    goal: GoalEnum;
    initialWeight: string;
    targetWeight: string;
    duration: string;
    unit: WeightUnitEnum;
    isPublic: boolean;
}

const goalOptions = [
    { label: "Perte de poids", value: GoalEnum.WEIGHT_LOSS },
    { label: "Maintien", value: GoalEnum.MAINTAIN },
    { label: "Prise de masse", value: GoalEnum.GAIN_MUSCLE }
];

export default function CreatePlanScreen() {
    const [formData, setFormData] = useState<CreatePlanData>({
        name: "",
        goal: GoalEnum.WEIGHT_LOSS,
        initialWeight: "",
        targetWeight: "",
        duration: "",
        unit: WeightUnitEnum.KG,
        isPublic: false
    });

    const handleChange = (name: keyof CreatePlanData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        // TODO: Implement plan creation logic
        console.log("Plan créé:", formData);
        router.back();
    };

    return (
        <Box style={styles.container}>
            <ImageBackground
                source={backgroundImage}
                style={styles.backgroundImage}
                blurRadius={5}
                resizeMode="cover"
            >
                <Box style={styles.contentOverlay}>
                    <VStack space="md" style={styles.content}>
                        <Text size="xl" className="font-bold text-white text-center">
                            Créer un nouveau plan
                        </Text>

                        <VStack space="sm">
                            <Box>
                                <Text className="text-sm text-white mb-1">Nom du plan</Text>
                                <Input>
                                    <InputField
                                        value={formData.name}
                                        onChangeText={(value: string) => handleChange("name", value)}
                                        placeholder="Ex: Mon plan de musculation"
                                        className="bg-white/80"
                                    />
                                </Input>
                            </Box>

                            <Box>
                                <Text className="text-sm text-white mb-1">Objectif</Text>
                                <Box className="bg-white/80 rounded-lg p-2">
                                    {goalOptions.map((option) => (
                                        <Pressable
                                            key={option.value}
                                            onPress={() => handleChange("goal", option.value)}
                                            style={[
                                                styles.goalOption,
                                                formData.goal === option.value && styles.goalOptionSelected
                                            ]}
                                        >
                                            <Text
                                                className={formData.goal === option.value ? "text-white" : "text-typography-600"}
                                            >
                                                {option.label}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </Box>
                            </Box>

                            <HStack space="sm">
                                <Box className="flex-1">
                                    <Text className="text-sm text-white mb-1">Poids initial (kg)</Text>
                                    <Input>
                                        <InputField
                                            value={formData.initialWeight}
                                            onChangeText={(value: string) => handleChange("initialWeight", value)}
                                            placeholder="70"
                                            keyboardType="numeric"
                                            className="bg-white/80"
                                        />
                                    </Input>
                                </Box>

                                <Box className="flex-1">
                                    <Text className="text-sm text-white mb-1">Poids cible (kg)</Text>
                                    <Input>
                                        <InputField
                                            value={formData.targetWeight}
                                            onChangeText={(value: string) => handleChange("targetWeight", value)}
                                            placeholder="65"
                                            keyboardType="numeric"
                                            className="bg-white/80"
                                        />
                                    </Input>
                                </Box>
                            </HStack>

                            <Box>
                                <Text className="text-sm text-white mb-1">Durée (semaines)</Text>
                                <Input>
                                    <InputField
                                        value={formData.duration}
                                        onChangeText={(value: string) => handleChange("duration", value)}
                                        placeholder="12"
                                        keyboardType="numeric"
                                        className="bg-white/80"
                                    />
                                </Input>
                            </Box>

                            <Box className="mt-2">
                                <HStack space="sm" className="bg-white/80 p-3 rounded-lg items-center">
                                    <Checkbox
                                        value={formData.isPublic}
                                        onChange={(value) => handleChange("isPublic", value)}
                                        accessibilityLabel="Rendre public"
                                    />
                                    <Text className="text-typography-600">Rendre ce plan public</Text>
                                </HStack>
                            </Box>

                            <Button
                                size="lg"
                                variant="solid"
                                action="primary"
                                className="mt-4"
                                onPress={handleSubmit}
                            >
                                <ButtonText>Créer le plan</ButtonText>
                            </Button>
                        </VStack>
                    </VStack>
                </Box>
            </ImageBackground>
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    contentOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 16,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    goalOption: {
        padding: 12,
        marginVertical: 4,
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    goalOptionSelected: {
        backgroundColor: primaryColor,
    },
});
