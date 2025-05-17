import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import React, { useState } from 'react';
import { introBackground } from '@/utils/constants/images';
import { HStack } from '@/components/ui/hstack';
import { IntroCard } from '@/components/cards/IntroCard';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ImageBackground } from 'react-native';
import { ChevronsLeft, ChevronsRight } from 'lucide-react-native';
import { Colors } from '@/utils/constants/Colors';

export enum IntroStepEnum {
  'ONE' = 'ONE',
  'TWO' = 'TWO',
}

export default function Intro() {
  const [step, setStep] = useState<IntroStepEnum>(IntroStepEnum.ONE);
  const router = useRouter();

  return (
    <Animated.View
      entering={FadeInDown.delay(300)}
      className={`flex items-center justify-center`}
    >
      <ImageBackground
        source={introBackground}
        className="size-full object-cover"
        blurRadius={0}
      >
        <VStack className="size-full items-center justify-between p-4">
          <HStack className="w-full justify-between">
            {step === IntroStepEnum.TWO && (
              <Button
                className="bg-primary-500 w-40"
                onPress={() => setStep(IntroStepEnum.ONE)}
              >
                <ChevronsLeft size={30} color={Colors.light.icon} />
                <ButtonText size="md" className="font-ubuntu text-white">
                  Previous
                </ButtonText>
              </Button>
            )}
            <Button
              className={` w-40 ${step === IntroStepEnum.ONE ? 'bg-primary-500' : 'bg-tertiary-500'}`}
              onPress={() => {
                if (step === IntroStepEnum.ONE) {
                  setStep(IntroStepEnum.TWO);
                } else {
                  console.log('register');
                  router.replace('/login');
                }
              }}
            >
              <ButtonText
                size="md"
                className="font-ubuntu font-semibold text-white"
              >
                {step === IntroStepEnum.ONE ? 'Next' : 'Start'}
              </ButtonText>
              <ChevronsRight size={30} color={Colors.light.icon} />
            </Button>
          </HStack>
          {step === IntroStepEnum.ONE ? (
            <IntroCard
              title="Better Eating plans"
              description="We provide better meal plans"
            />
          ) : (
            <IntroCard
              title="Better Workout plans"
              description="We provide better workout plans"
            />
          )}
        </VStack>
      </ImageBackground>
    </Animated.View>
  );
}
