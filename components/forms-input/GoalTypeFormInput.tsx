import React from 'react';
import { View } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { GoalEnum } from '@/utils/enum/user-details.enum';
import { goalFormService } from '@/utils/services/goal-form.service';

interface GoalTypeFormInputProps {
  selectedGoal: GoalEnum;
  onGoalChange: (goal: GoalEnum) => void;
}

const GoalTypeFormInput: React.FC<GoalTypeFormInputProps> = ({
  selectedGoal,
  onGoalChange,
}) => {
  // Obtenir toutes les options d'objectifs du service
  const goalOptions = goalFormService.getGoalOptions();
  
  return (
    <View>
      <Text className="text-gray-700 font-medium mb-2">Goal Type</Text>
      <View className="flex-row justify-between mb-4">
        {goalOptions.map((option) => {
          // Obtenir les styles pour ce bouton en fonction de l'objectif sélectionné
          const styles = goalFormService.getGoalButtonStyles(selectedGoal, option.value);
          
          return (
            <Button
              key={option.value}
              className={styles.buttonClass}
              onPress={() => onGoalChange(option.value)}
            >
              <ButtonText className={styles.textClass}>
                {option.label}
              </ButtonText>
            </Button>
          );
        })}
      </View>
    </View>
  );
};

export default GoalTypeFormInput;
