import React from 'react';
import { Clock } from 'lucide-react-native';
import { HStack } from '@/components/ui/hstack'; // Assuming you're using Lucide icons
import { DayEnum } from '@/utils/enum/general.enum';
import { Button, ButtonIcon, ButtonText } from '../ui/button';

// Define props for the component
interface WeekDaysBoxProps {
  selectedDay: DayEnum;
  handleDayClick: (day: DayEnum) => void;
  className?: string;
}

const WeekDaysBox: React.FC<WeekDaysBoxProps> = ({
  selectedDay,
  handleDayClick,
  className = '',
}) => {
  const daysOfWeek = Object.values(DayEnum);
  return (
    <HStack className={`justify-around mt-4 ${className}`}>
      {daysOfWeek.map((day, index: number) => (
        <Button
          key={index}
          onPress={() => handleDayClick(day)}
          className={`rounded-full h-20 flex flex-col items-center justify-center p-2 ${day === selectedDay ? 'bg-primary-500' : 'bg-primary-100'}`}
        >
          <ButtonText className="text-sm text-center text-white">
            {day.substring(0, 3)}
          </ButtonText>
          <ButtonIcon as={Clock} className="w-6 h-6" />
        </Button>
      ))}
    </HStack>
  );
};

export default WeekDaysBox;
