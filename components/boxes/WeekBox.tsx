import React, { Dispatch, SetStateAction, memo, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnUI,
} from 'react-native-reanimated';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { HStack } from '../ui/hstack';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { Text } from '../ui/text';
import { Box } from '../ui/box';

interface WeekBoxProps {
  selectedWeek: number;
  durationWeeks: number;
  setSelectedWeek: Dispatch<SetStateAction<number>>;
}

const WeekBox: React.FC<WeekBoxProps> = memo(({ 
  selectedWeek,
  durationWeeks,
  setSelectedWeek,
}) => {
  // Initialiser avec 0 pour éviter l'assignation pendant le rendu
  const weekAnimation = useSharedValue(0);
  
  // Mettre à jour la valeur initiale après le premier rendu
  useEffect(() => {
    runOnUI(() => {
      weekAnimation.value = selectedWeek;
    })();
  }, []); // Exécuter seulement au montage

  // Handle week changes with animation
  const handleWeekChange = (direction: 'left' | 'right') => {
    if (direction === 'left' && selectedWeek > 1) {
      setSelectedWeek((prev) => prev - 1);
      // Mettre à jour l'animation sur le thread UI
      runOnUI(() => {
        weekAnimation.value = withSpring(selectedWeek - 1);
      })();
    } else if (direction === 'right' && selectedWeek < durationWeeks) {
      setSelectedWeek((prev) => prev + 1);
      // Mettre à jour l'animation sur le thread UI
      runOnUI(() => {
        weekAnimation.value = withSpring(selectedWeek + 1);
      })();
    }
  };
  
  // Mettre à jour l'animation lorsque selectedWeek change par une autre source
  useEffect(() => {
    runOnUI(() => {
      weekAnimation.value = withSpring(selectedWeek);
    })();
  }, [selectedWeek]);

  // Animated style for the week number
  const animatedWeekStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(1.2) }, // Toujours animer vers la même échelle pour simplifier
      ],
      opacity: withSpring(1), // Toujours pleine opacité
    };
  });

  return (
    <HStack className="items-center justify-between border border-gray-500 p-1 rounded-lg">
      {/* Left Chevron */}
      <Button
        onPress={() => handleWeekChange('left')}
        disabled={selectedWeek === 1}
        className={`bg-tertiary-500 p-1 w-10 h-10 ${
          selectedWeek === 1 ? 'opacity-50' : 'opacity-100'
        }`}
      >
        <Icon as={ChevronLeft} className="w-8 h-8" />
      </Button>

      {/* Animated Week Number */}
      <Box className="flex-row items-center justify-center">
        <Text className="text-2xl font-bold text-primary-500">Week-</Text>
        <Animated.Text
          className="text-xl font-bold text-tertiary-500"
          style={animatedWeekStyle}
        >
          {selectedWeek}
        </Animated.Text>
      </Box>

      {/* Right Chevron */}
      <Button
        onPress={() => handleWeekChange('right')}
        disabled={selectedWeek === durationWeeks}
        className={`p-1 w-10 h-10 bg-tertiary-500 ${
          selectedWeek === durationWeeks ? 'opacity-50' : 'opacity-100'
        }`}
      >
        <Icon as={ChevronRight} className="w-8 h-8" />
      </Button>
    </HStack>
  );
});

// Ajouter un displayName pour faciliter le débogage
WeekBox.displayName = 'WeekBox';

export default WeekBox;
