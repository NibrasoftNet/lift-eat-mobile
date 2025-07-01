import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import React, { useState } from 'react';
import { introBackground } from '@/utils/constants/images';
import { HStack } from '@/components/ui/hstack';
import { IntroCard } from '@/components/cards/IntroCard';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ImageBackground } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { ChevronsLeft, ChevronsRight } from 'lucide-react-native';

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
                className="bg-blue-500 w-40"
                onPress={() => setStep(IntroStepEnum.ONE)}
              >
                <Icon as={ChevronsLeft} className="w-10 h-10 text-white" />
                <ButtonText size="md" className="font-ubuntu">
                  Previous
                </ButtonText>
              </Button>
            )}
            <Button
              className={`w-40 ${step === IntroStepEnum.ONE ? 'bg-primary-500' : 'bg-tertiary-500'}`}
              onPress={() => {
                if (step === IntroStepEnum.ONE) {
                  setStep(IntroStepEnum.TWO);
                } else {
                  router.replace('/register');
                }
              }}
            >
              <ButtonText size="md" className="font-ubuntu font-semibold">
                {step === IntroStepEnum.ONE ? 'Next' : 'Start'}
              </ButtonText>
              <Icon as={ChevronsRight} className="w-10 h-10 text-white" />
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
/*
[
  "expo-font",
  {
    "fonts": [
      "./assets/fonts/Rubik-Bold.ttf",
      "./assets/fonts/Rubik-ExtraBold.ttf",
      "./assets/fonts/Rubik-Light.ttf",
      "./assets/fonts/Rubik-Medium.ttf",
      "./assets/fonts/Rubik-Regular.ttf",
      "./assets/fonts/Rubik-SemiBold.ttf"
    ]
  }
]*/
