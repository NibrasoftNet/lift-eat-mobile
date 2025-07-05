import Box from '@/components-new/ui/atoms/base/Box';
import Button from '@/components-new/ui/atoms/inputs/Button';
import Text from '@/components-new/ui/atoms/base/Text';
import React, { useState } from 'react';
import { introBackground } from '@/utils/constants/images';

import IntroCard from '@/components-new/ui/molecules/display/IntroCard';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ImageBackground } from 'react-native';
import Icon from '@/components-new/ui/atoms/display/Icon';
import { ChevronsLeft, ChevronsRight } from 'lucide-react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';

export enum IntroStepEnum {
  'ONE' = 'ONE',
  'TWO' = 'TWO',
}

export default function Intro() {
  const [step, setStep] = useState<IntroStepEnum>(IntroStepEnum.ONE);
  const router = useRouter();
  const theme = useAppTheme();

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
        <Box
          flex={1}
          column
          justifyContent="space-between"
          alignItems="center"
          p={16}
        >
          <Box
            row
            justifyContent="space-between"
            alignItems="center"
            style={{ width: '100%' }}
          >
            {step === IntroStepEnum.TWO && (
              <Button
                color={theme.color('secondary')}
                onPress={() => setStep(IntroStepEnum.ONE)}
                leftIcon={<Icon as={ChevronsLeft} size={24} color="#FFFFFF" />}
              >
                <Text variant="button" color="#FFFFFF">
                  Previous
                </Text>
              </Button>
            )}
            <Button
              color={
                step === IntroStepEnum.ONE
                  ? theme.color('secondary')
                  : theme.color('violet')
              }
              onPress={() => {
                if (step === IntroStepEnum.ONE) {
                  setStep(IntroStepEnum.TWO);
                } else {
                  router.replace('../(auth)/register');
                }
              }}
              rightIcon={<Icon as={ChevronsRight} size={24} color="#FFFFFF" />}
            >
              <Text variant="button" color="#FFFFFF" semibold>
                {step === IntroStepEnum.ONE ? 'Next' : 'Start'}
              </Text>
            </Button>
          </Box>
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
        </Box>
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
