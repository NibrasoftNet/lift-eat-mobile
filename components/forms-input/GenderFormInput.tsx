import { Card } from '../ui/card';
import { Grid, GridItem } from '../ui/grid';
import { Button, ButtonText } from '../ui/button';
import { GenderEnum } from '../../utils/enum/user-gender-activity.enum';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import React, { useEffect, useState, memo } from 'react';
import { genderFormService } from '@/utils/services/gender-form.service';

const GenderFormInput = memo(({ 
  defaultGender,
  setValue,
}: {
  defaultGender: GenderEnum;
  setValue: any;
}) => {
  const [genderUnit, setGenderUnit] = useState<GenderEnum>(defaultGender);
  
  // Initialiser les valeurs partagées sans condition dans le rendu
  const maleBarWidth = useSharedValue(0); 
  const femaleBarWidth = useSharedValue(0);
  
  // Mettre à jour les valeurs partagées en fonction du genre initial
  useEffect(() => {
    // Utiliser le service pour initialiser les animations
    genderFormService.initializeGenderAnimations(defaultGender, maleBarWidth, femaleBarWidth);
  }, []);
  
  const handleGenderUnitChange = (unit: GenderEnum) => {
    setGenderUnit(unit);
    setValue('gender', unit);
  };

  // Animer la largeur de la barre lorsque le genre change
  useEffect(() => {
    // Utiliser le service pour animer le changement de genre
    genderFormService.animateGenderChange(genderUnit, maleBarWidth, femaleBarWidth, 300);
  }, [genderUnit]);

  // Définir les couleurs à l'extérieur du style animé
  const maleBarColor = "blue";
  const femaleBarColor = "orange";
  
  // Animated style for Male bar
  const maleBarStyles = useAnimatedStyle(() => {
    'worklet';
    return {
      width: `${maleBarWidth.value}%`, // Animate width from 0% to 100% or vice versa
      backgroundColor: maleBarColor,
    };
  });

  // Animated style for Female bar
  const femaleBarStyles = useAnimatedStyle(() => {
    'worklet';
    return {
      width: `${femaleBarWidth.value}%`, // Animate width from 0% to 100% or vice versa
      backgroundColor: femaleBarColor,
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
            className={genderFormService.getGenderButtonStyles(genderUnit, GenderEnum.MALE).buttonClass}
          >
            <ButtonText className={genderFormService.getGenderButtonStyles(genderUnit, GenderEnum.MALE).textClass}>
              {GenderEnum.MALE}
            </ButtonText>
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
            className={genderFormService.getGenderButtonStyles(genderUnit, GenderEnum.FEMALE).buttonClass}
          >
            <ButtonText className={genderFormService.getGenderButtonStyles(genderUnit, GenderEnum.FEMALE).textClass}>
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
});

// Ajouter un displayName pour faciliter le débogage
GenderFormInput.displayName = 'GenderFormInput';

export default GenderFormInput;
