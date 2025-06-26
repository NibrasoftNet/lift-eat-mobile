import { Card } from '../ui/card';
import { Button, ButtonText } from '../ui/button';
import { PhysicalActivityEnum } from '../../utils/enum/user-gender-activity.enum';
import Animated from 'react-native-reanimated';
import React, { useState } from 'react';
import { activityOptions } from '@/utils/constants/constant';
import { ImageBackground, View } from 'react-native';
import { GetPhysicalActivityImages } from '@/utils/utils';

const PhysicalActivityFormInput = ({
  defaultPhysicalActivity,
  setValue,
}: {
  defaultPhysicalActivity: PhysicalActivityEnum;
  setValue: any;
}) => {
  const [activityUnit, setActivityUnit] = useState<PhysicalActivityEnum>(
    defaultPhysicalActivity,
  );

  const handleActivityUnitChange = (level: PhysicalActivityEnum) => {
    setActivityUnit(level);
    setValue('physicalActivity', level);
  };

  return (
    <Card className="rounded-lg w-full">
      <View className="flex flex-row flex-wrap">
        {activityOptions.map((activity, index) => (
          <View key={activity.level} className="w-1/2 aspect-square p-1">
            <ImageBackground
              source={GetPhysicalActivityImages[activity.level]}
              className="w-full h-full"
              blurRadius={1}
            >
              <Animated.View
                className={`w-full h-1 rounded-md ${activity.level === activityUnit ? 'bg-primary-500' : 'bg-secondary-500'}`}
              />
              <Button
                onPress={() => handleActivityUnitChange(activity.level)}
                className="flex flex-col items-center justify-center w-full h-full bg-transparent"
              >
                <ButtonText className="text-white capitalize">
                  {activity.level}
                </ButtonText>
              </Button>
            </ImageBackground>
          </View>
        ))}
      </View>
    </Card>
  );
};

export default PhysicalActivityFormInput;
