import React from 'react';
import { View } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { GoalEnum } from '@/utils/enum/user-details.enum';

interface GoalTypeFormInputProps {
  selectedGoal: GoalEnum;
  onGoalChange: (goal: GoalEnum) => void;
}

const GoalTypeFormInput: React.FC<GoalTypeFormInputProps> = ({
  selectedGoal,
  onGoalChange,
}) => {
  return (
    <View>
      <Text className="text-gray-700 font-medium mb-2">Goal Type</Text>
      <View className="flex-row justify-between mb-4">
        <Button
          className={`flex-1 mx-1 ${
            selectedGoal === GoalEnum.MAINTAIN
              ? 'bg-blue-600'
              : 'bg-gray-200'
          }`}
          onPress={() => onGoalChange(GoalEnum.MAINTAIN)}
        >
          <ButtonText
            className={
              selectedGoal === GoalEnum.MAINTAIN
                ? 'text-white'
                : 'text-gray-700'
            }
          >
            Maintain
          </ButtonText>
        </Button>
        <Button
          className={`flex-1 mx-1 ${
            selectedGoal === GoalEnum.WEIGHT_LOSS
              ? 'bg-blue-600'
              : 'bg-gray-200'
          }`}
          onPress={() => onGoalChange(GoalEnum.WEIGHT_LOSS)}
        >
          <ButtonText
            className={
              selectedGoal === GoalEnum.WEIGHT_LOSS
                ? 'text-white'
                : 'text-gray-700'
            }
          >
            Lose
          </ButtonText>
        </Button>
        <Button
          className={`flex-1 mx-1 ${
            selectedGoal === GoalEnum.GAIN_MUSCLE
              ? 'bg-blue-600'
              : 'bg-gray-200'
          }`}
          onPress={() => onGoalChange(GoalEnum.GAIN_MUSCLE)}
        >
          <ButtonText
            className={
              selectedGoal === GoalEnum.GAIN_MUSCLE
                ? 'text-white'
                : 'text-gray-700'
            }
          >
            Gain
          </ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default GoalTypeFormInput;
