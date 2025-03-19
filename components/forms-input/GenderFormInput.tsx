import { Card } from '../ui/card';
import { Grid, GridItem } from '../ui/grid';
import { Button, ButtonText } from '../ui/button';
import { GenderEnum } from '../../utils/enum/user-gender-activity.enum';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import React, { useEffect, useState } from 'react';

const GenderFormInput = ({
  defaultGender,
  setValue,
}: {
  defaultGender: GenderEnum;
  setValue: any;
}) => {
  const [genderUnit, setGenderUnit] = useState<GenderEnum>(defaultGender);
  const handleGenderUnitChange = (unit: GenderEnum) => {
    setGenderUnit(unit);
    setValue('gender', unit);
  };
  // Shared values for Male and Female bar widths
  const maleBarWidth = useSharedValue(genderUnit === GenderEnum.MALE ? 100 : 0); // 100% = blue, 0% = gray
  const femaleBarWidth = useSharedValue(
    genderUnit === GenderEnum.FEMALE ? 100 : 0,
  ); // 100% = orange, 0% = gray

  // Animate bar width
  useEffect(() => {
    maleBarWidth.value = withTiming(genderUnit === GenderEnum.MALE ? 100 : 0, {
      duration: 300,
    });
    femaleBarWidth.value = withTiming(
      genderUnit === GenderEnum.FEMALE ? 100 : 0,
      { duration: 300 },
    );
  }, [genderUnit]);

  // Animated style for Male bar
  const maleBarStyles = useAnimatedStyle(() => {
    return {
      width: `${maleBarWidth.value}%`, // Animate width from 0% to 100% or vice versa
      backgroundColor: 'blue', // Blue color for Male bar
    };
  });

  // Animated style for Female bar
  const femaleBarStyles = useAnimatedStyle(() => {
    return {
      width: `${femaleBarWidth.value}%`, // Animate width from 0% to 100% or vice versa
      backgroundColor: 'orange', // Orange color for Female bar
    };
  });
  return (
    <Card className="rounded-lg flex flex-col gap-2">
      <Grid
        className="w-full h-16 gap-2"
        _extra={{ className: 'grid-cols-2' }}
        style={{ position: 'relative' }}
      >
        {/* Male Button */}
        <GridItem
          _extra={{ className: 'col-span-1' }}
          className="bg-gray-200 border border-gray-300 rounded-md"
        >
          <Button
            onPress={() => handleGenderUnitChange(GenderEnum.MALE)}
            className="w-full h-full bg-transparent"
          >
            <ButtonText className="text-gray-500">{GenderEnum.MALE}</ButtonText>
          </Button>
          {/* Blue animated bar for Male Button */}
          <Animated.View
            className="absolute bottom-0 h-1"
            style={[maleBarStyles, { left: 0 }]} // Animate from left to right
          />
        </GridItem>

        {/* Female Button */}
        <GridItem
          _extra={{ className: 'col-span-1' }}
          className="bg-gray-200 border border-gray-300 rounded-md"
        >
          <Button
            onPress={() => handleGenderUnitChange(GenderEnum.FEMALE)}
            className="w-full h-full bg-transparent"
          >
            <ButtonText className="text-gray-500">
              {GenderEnum.FEMALE}
            </ButtonText>
          </Button>
          {/* Orange animated bar for Female Button */}
          <Animated.View
            className="absolute bottom-0 h-1"
            style={[femaleBarStyles, { right: 0 }]} // Animate from right to left
          />
        </GridItem>
      </Grid>
    </Card>
  );
};

export default GenderFormInput;
