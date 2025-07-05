import { HStack } from '../ui/hstack';
import NutritionBox from './NutritionBox';
import { Divider } from '../ui/divider';
import React from 'react';
import { MacroNutrientsBase } from '@/types/nutrition.type';

/**
 * Interface pour les propriétés du composant MacrosDetailsBox
 * Ce composant affiche simplement les valeurs nutritionnelles sans effectuer de normalisation
 * Les valeurs doivent être déjà normalisées par les services avant d'être passées au composant
 */
interface MacrosDetailsBoxProps {
  carbs: number;
  fats: number;
  protein: number;
  unit: string;
  calories?: number;
  areValuesInGrams?: boolean;
  showDividers?: boolean;
}

/**
 * Composant MacrosDetailsBox - Affiche les macronutriments dans des boîtes colorées
 * 
 * Ce composant est purement présentationnel et n'effectue aucun calcul ou normalisation.
 * Il affiche simplement les valeurs qui lui sont fournies.
 */
const MacrosDetailsBox: React.FC<MacrosDetailsBoxProps> = ({
  carbs,
  fats,
  protein,
  unit,
  calories = 0,
  areValuesInGrams = true,
  showDividers = true
}) => {
  // Convertir les pourcentages en grammes si nécessaire
  let displayCarbs = carbs;
  let displayFats = fats;
  let displayProtein = protein;
  
  // Si les valeurs sont en pourcentages (généralement < 100) et qu'on a des calories
  if (!areValuesInGrams && calories > 0) {
    // Même logique que dans getPlanNutritionGoals
    // 1g de glucides = 4 calories
    // 1g de protéines = 4 calories
    // 1g de lipides = 9 calories
    displayCarbs = Math.round((calories * (carbs / 100)) / 4);
    displayProtein = Math.round((calories * (protein / 100)) / 4);
    displayFats = Math.round((calories * (fats / 100)) / 9);
  }

  return (
    <HStack className="w-full justify-around pt-3 border-t border-gray-100">
      {/* Carbs */}
      <NutritionBox
        title="Carbs"
        value={displayCarbs}
        unit={unit}
        nutrientType="carbs"
        className="w-24"
        titleClassName="bg-amber-500"
        valueClassName="bg-amber-300"
      />
      {/* Divider between items */}
      {showDividers && (
        <Divider
          orientation="vertical"
          className={`w-0.5 h-14 bg-gray-100 mx-3`}
        />
      )}

      {/* Fats */}
      <NutritionBox
        title="Fats"
        value={displayFats}
        unit={unit}
        nutrientType="fat"
        className="w-24"
        titleClassName="bg-green-500"
        valueClassName="bg-green-300"
      />

      {/* Divider between items */}
      {showDividers && (
        <Divider
          orientation="vertical"
          className={`w-0.5 h-14 bg-gray-300 mx-3`}
        />
      )}

      {/* Protein */}
      <NutritionBox
        title="Protein"
        value={displayProtein}
        unit={unit}
        nutrientType="protein"
        className="w-24"
        titleClassName="bg-blue-500"
        valueClassName="bg-blue-300"
      />
    </HStack>
  );
};

export default MacrosDetailsBox;
