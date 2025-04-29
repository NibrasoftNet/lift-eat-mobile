import { Card } from '../ui/card';
import { Grid, GridItem } from '../ui/grid';
import { Button, ButtonText } from '../ui/button';
import { PhysicalActivityEnum } from '../../utils/enum/user-gender-activity.enum';
import Animated from 'react-native-reanimated';
import React, { useState } from 'react';
import { ImageBackground } from 'react-native';
import { physicalActivityFormService } from '@/utils/services/forms/form-physical-activity.service';

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

  // Utiliser le service pour obtenir les options d'activité
  const activityOptions = physicalActivityFormService.getPhysicalActivityOptions();

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
        {activityOptions.map((activity) => {
          // Obtenir l'image pour ce niveau d'activité
          const activityImage = physicalActivityFormService.getPhysicalActivityImage(activity.level);
          // Obtenir les styles pour l'indicateur d'activité
          const indicatorClass = physicalActivityFormService.getActivityIndicatorStyles(
            activityUnit, activity.level
          );
          // Obtenir les styles pour le bouton d'activité
          const buttonStyles = physicalActivityFormService.getActivityButtonStyles(
            activityUnit, activity.level
          );
          
          return (
            <GridItem
              key={activity.level}
              _extra={{ className: 'col-span-1' }}
              className="rounded-md"
            >
              <ImageBackground
                source={activityImage}
                className="w-full object-cover h-24"
                blurRadius={3}
              >
                <Animated.View
                  className={`w-full h-1 rounded-md ${indicatorClass}`}
                />
                <Button
                  onPress={() => handleActivityUnitChange(activity.level)}
                  className={buttonStyles.buttonClass}
                >
                  <ButtonText className={buttonStyles.textClass}>
                    {activity.level}
                  </ButtonText>
                </Button>
              </ImageBackground>
            </GridItem>
          );
        })}
      </Grid>
    </Card>
  );
};

export default PhysicalActivityFormInput;
