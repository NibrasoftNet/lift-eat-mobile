import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { HStack } from '../ui/hstack';
import Animated, { SlideInLeft } from 'react-native-reanimated';

type IntroCardProps = {
  title: string;
  description: string;
};

export const IntroCard = ({ title, description }: IntroCardProps) => {
  return (
    <Animated.View
      entering={SlideInLeft.delay(300).duration(1000).springify().damping(12)}
    >
      <HStack className="bg-transparent rounded-lg">
        <VStack className="mb-6">
          <Text className="text-3xl text-tertiary-500 text-center mb-2 ">
            {title}
          </Text>
          <Text className="font-ubuntu-medium text-lg text-tertiary-500 text-center">
            {description}
          </Text>
        </VStack>
      </HStack>
    </Animated.View>
  );
};
