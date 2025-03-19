import { Card } from '../ui/card';
import { Grid, GridItem } from '../ui/grid';
import { Button, ButtonText } from '../ui/button';
import { PhysicalActivityEnum } from '../../utils/enum/user-gender-activity.enum';
import Animated from 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { activityOptions } from '@/utils/constants/constant';
import { ImageBackground } from 'react-native';
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
    <Card className="rounded-lg flex flex-col gap-2">
      <Grid
        className="w-full h-52 gap-2"
        _extra={{ className: 'grid-cols-2' }}
        style={{ position: 'relative' }}
      >
        {activityOptions.map((activity, index) => (
          <GridItem
            key={activity.level}
            _extra={{ className: 'col-span-1' }}
            className="rounded-md"
          >
            <ImageBackground
              source={GetPhysicalActivityImages[activity.level]}
              className="w-full object-cover h-24"
              blurRadius={3}
            >
              <Animated.View
                className={`w-full h-1 rounded-md ${activity.level === activityUnit ? 'bg-primary-500' : 'bg-secondary-500'}`}
              />
              <Button
                onPress={() => handleActivityUnitChange(activity.level)}
                className="flex flex-col items-center justify-center w-full h-24 bg-transparent"
              >
                <ButtonText className="text-white capitalize">
                  {activity.level}
                </ButtonText>
              </Button>
              {/* Animated Indicator for Activity Selection */}
            </ImageBackground>
          </GridItem>
        ))}
      </Grid>
    </Card>
  );
};

export default PhysicalActivityFormInput;
