import React from 'react';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectItem, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper } from '@/components/ui/select';
import { DietaryRestrictionEnum } from '@/utils/enum/user-details.enum';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

interface DietaryRestrictionsInputProps {
  defaultRestrictions?: DietaryRestrictionEnum[];
  setValue: (name: string, value: any) => void;
}

export default function DietaryRestrictionsInput({
  defaultRestrictions = [],
  setValue
}: DietaryRestrictionsInputProps) {
  // État local pour gérer les restrictions sélectionnées
  const [selectedRestrictions, setSelectedRestrictions] = React.useState<DietaryRestrictionEnum[]>(defaultRestrictions);
  
  logger.debug(
    LogCategory.FORM,
    'Rendering DietaryRestrictionsInput component'
  );

  const restrictionOptions = [
    DietaryRestrictionEnum.NONE,
    DietaryRestrictionEnum.VEGETARIAN,
    DietaryRestrictionEnum.VEGAN,
    DietaryRestrictionEnum.GLUTEN_FREE,
    DietaryRestrictionEnum.DAIRY_FREE,
    DietaryRestrictionEnum.PALEO,
    DietaryRestrictionEnum.KETO,
    DietaryRestrictionEnum.LOW_CARB,
    DietaryRestrictionEnum.HALAL,
    DietaryRestrictionEnum.KOSHER,
  ];

  const formatRestrictionName = (restriction: string): string => {
    if (restriction === DietaryRestrictionEnum.NONE) {
      return "Aucune restriction";
    }
    // Remplacer tous les underscores par des espaces et mettre en forme
    return restriction.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Gère le changement de restriction alimentaire
  const handleRestrictionChange = (value: string) => {
    logger.debug(
      LogCategory.FORM,
      `Changing dietary restriction: ${value}`
    );
    
    const newRestrictions = [value as DietaryRestrictionEnum];
    setSelectedRestrictions(newRestrictions);
    setValue('dietaryRestrictions', newRestrictions);
  };

  // Déterminer la valeur actuellement sélectionnée
  const currentValue = selectedRestrictions.length > 0 ? selectedRestrictions[0] : DietaryRestrictionEnum.NONE;

  return (
    <Card className="p-4">
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText className="text-lg font-semibold">
            Restrictions alimentaires
          </FormControlLabelText>
        </FormControlLabel>
        
        <Box className="mt-2">
          <Text className="mb-1 font-medium">Sélectionnez votre régime alimentaire</Text>
          <Select
            selectedValue={currentValue}
            onValueChange={handleRestrictionChange}
          >
            <SelectTrigger size="lg" className="h-12">
              <SelectInput 
                placeholder="Choisir une restriction" 
                style={{fontSize: 16}}
              />
            </SelectTrigger>
            <SelectPortal>
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {restrictionOptions.map((restriction) => (
                  <SelectItem 
                    key={restriction} 
                    label={formatRestrictionName(restriction)} 
                    value={restriction} 
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </Box>
      </FormControl>
    </Card>
  );
}
