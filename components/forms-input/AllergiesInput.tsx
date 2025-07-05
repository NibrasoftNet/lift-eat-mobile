import React from 'react';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectItem,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
} from '@/components/ui/select';
import { AllergyEnum } from '@/utils/enum/user-details.enum';
import { logger } from '@/utils/services/common/logging.service';
import { LogCategory } from '@/utils/enum/logging.enum';

interface AllergiesInputProps {
  defaultAllergies?: AllergyEnum[];
  setValue: (name: string, value: any) => void;
}

export default function AllergiesInput({
  defaultAllergies = [],
  setValue,
}: AllergiesInputProps) {
  const [selectedAllergies, setSelectedAllergies] = React.useState<
    AllergyEnum[]
  >(defaultAllergies || []);

  // Options disponibles pour les allergies
  const allergyOptions = [
    AllergyEnum.NONE,
    AllergyEnum.EGGS,
    AllergyEnum.FISH,
    AllergyEnum.MILK,
    AllergyEnum.PEANUTS,
    AllergyEnum.SHELLFISH,
    AllergyEnum.SOY,
    AllergyEnum.TREE_NUTS,
    AllergyEnum.WHEAT,
  ];

  // Formater le nom de l'allergie pour l'affichage
  const formatAllergyName = (allergy: string): string => {
    if (allergy === AllergyEnum.NONE) {
      return 'Aucune allergie';
    }
    // Remplacer les underscores par des espaces et mettre en forme
    return allergy
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Gérer le changement d'allergie
  const handleAllergyChange = (value: string) => {
    logger.debug(LogCategory.FORM, `Changing allergy: ${value}`);

    const newAllergies = [value as AllergyEnum];
    setSelectedAllergies(newAllergies);
    setValue('allergies', newAllergies);
  };

  // Déterminer la valeur actuellement sélectionnée
  const currentValue =
    selectedAllergies.length > 0 ? selectedAllergies[0] : AllergyEnum.NONE;

  return (
    <Card className="p-4">
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText className="text-lg font-semibold">
            Allergies
          </FormControlLabelText>
        </FormControlLabel>

        <Box className="mt-2">
          <Text className="mb-1 font-medium">Sélectionnez vos allergies</Text>
          <Select
            selectedValue={currentValue}
            onValueChange={handleAllergyChange}
          >
            <SelectTrigger size="lg" className="h-12">
              <SelectInput
                placeholder="Choisir une allergie"
                style={{ fontSize: 16 }}
              />
            </SelectTrigger>
            <SelectPortal>
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {allergyOptions.map((allergy) => (
                  <SelectItem
                    key={allergy}
                    label={formatAllergyName(allergy)}
                    value={allergy}
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
