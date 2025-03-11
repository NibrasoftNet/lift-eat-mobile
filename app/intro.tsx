import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { intro01, intro02 } from '@/utils/constants/images';
import { HStack } from '@/components/ui/hstack';
import { IntroCard } from '@/components/cards/IntroCard';
import { useRouter } from 'expo-router';

export enum IntroStepEnum {
  'ONE' = 'ONE',
  'TWO' = 'TWO',
}

export default function Intro() {
  const [step, setStep] = useState<IntroStepEnum>(IntroStepEnum.ONE);
  const router = useRouter();

  return (
    <VStack className="mb-6">
      <HStack className="w-full justify-between mt-10 mx-4">
        {step === IntroStepEnum.TWO && (
          <Button
            className="bg-blue-500 w-40"
            onPress={() => setStep(IntroStepEnum.ONE)}
          >
            <MaterialCommunityIcons name="chevron-double-left" size={24} />
            <ButtonText size="md">Previous</ButtonText>
          </Button>
        )}
        <Button
          className={`w-40 ${step === IntroStepEnum.ONE ? 'bg-blue-500' : 'bg-amber-500'}`}
          onPress={() => {
            if (step === IntroStepEnum.ONE) {
              setStep(IntroStepEnum.TWO);
            } else {
              router.replace('/register');
            }
          }}
        >
          <ButtonText size="md">
            {' '}
            {step === IntroStepEnum.ONE ? 'Next' : 'Start'}
          </ButtonText>
          <MaterialCommunityIcons name="chevron-double-right" size={24} />
        </Button>
      </HStack>

      {step === IntroStepEnum.ONE ? (
        <IntroCard
          title="Better Eating plans"
          description="We provide better meal plans"
          imageUrl={intro01}
        />
      ) : (
        <IntroCard
          title="Better Workout plans"
          description="We provide better workout plans"
          imageUrl={intro02}
        />
      )}
      <Box className="flex-row justify-between px-6">
        <MaterialCommunityIcons
          name="fruit-pineapple"
          className={`${step === IntroStepEnum.ONE ? 'bg-blue-500' : 'bg-gray-500'} rounded-2xl p-2 shadow-md shadow-black`}
          size={30}
          color="white"
        />
        <MaterialCommunityIcons
          name="dumbbell"
          className={`${step === IntroStepEnum.TWO ? 'bg-amber-500' : 'bg-gray-500'} rounded-2xl p-2 shadow-md shadow-black`}
          size={30}
          color="white"
        />
      </Box>
    </VStack>
  );
}
