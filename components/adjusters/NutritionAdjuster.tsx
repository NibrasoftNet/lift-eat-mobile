import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MacroNutrientsBase } from '@/types/nutrition.type';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import { Card } from '../ui/card';
import { Slider } from '../ui/slider';
import { Button, ButtonText } from '../ui/button';
// Imports conformes à l'architecture MCP
import { nutritionEngine } from '@/utils/engines/nutrition-engine';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';
import { roundToDecimals } from '@/utils/helpers/precision.helper';
import { MacroCalorieFactors } from '@/utils/constants/NutritionConstants';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate
} from 'react-native-reanimated';

// Composant Animated Text
const AnimatedText = Animated.createAnimatedComponent(Text);

interface NutritionAdjusterProps {
  initialMacros: MacroNutrientsBase;
  onAdjust?: (macros: MacroNutrientsBase) => void;
  className?: string;
  locked?: boolean;
  
  // Support du mode MCP - si mealId est fourni, les valeurs initiales seront récupérées via MCP
  mealId?: number;
  userId?: number;
}

/**
 * Composant pour ajuster manuellement les valeurs nutritionnelles
 * Permet d'ajuster les macros individuellement ou en suivant certains ratios prédéfinis
 */
export const NutritionAdjuster: React.FC<NutritionAdjusterProps> = ({
  initialMacros,
  onAdjust,
  className = '',
  locked = false,
  mealId,
  userId,
}) => {
  // Déterminer si on utilise le mode MCP
  const useMcpMode = !!mealId;
  
  // État pour suivre le chargement des données nutritionnelles
  const [mcpLoading, setMcpLoading] = useState(false);
  const [mcpError, setMcpError] = useState<string | null>(null);
  const [normalizedNutrition, setNormalizedNutrition] = useState<MacroNutrientsBase | null>(null);
  
  // Récupérer les valeurs nutritionnelles via le service de pages
  useEffect(() => {
    if (useMcpMode && mealId) {
      setMcpLoading(true);
      nutritionEngine.getMealNutrition(mealId, 100, NutritionDisplayMode.PER_100G)
        .then((result: { 
          success: boolean; 
          error?: string; 
          calories?: number; 
          carbs?: number; 
          fat?: number; 
          protein?: number;
          unit?: string;
        }) => {
          if (result.success) {
            // Construire l'objet macros à partir des valeurs retournées
            setNormalizedNutrition({
              calories: result.calories || 0,
              carbs: result.carbs || 0,
              protein: result.protein || 0,
              fat: result.fat || 0,
              unit: result.unit || 'g'
            });
            setMcpError(null);
          } else {
            setMcpError(result.error || 'Erreur lors du chargement des données nutritionnelles');
            setNormalizedNutrition(null);
          }
        })
        .catch((error: unknown) => {
          setMcpError(error instanceof Error ? error.message : 'Erreur inconnue');
          setNormalizedNutrition(null);
        })
        .finally(() => {
          setMcpLoading(false);
        });
    }
  }, [useMcpMode, mealId]);
  
  // Utiliser les valeurs MCP ou les valeurs initiales fournies
  const effectiveInitialMacros = useMcpMode && !mcpLoading && !mcpError && normalizedNutrition
    ? normalizedNutrition
    : initialMacros;
  
  // États pour les valeurs nutritionnelles
  const [macros, setMacros] = useState<MacroNutrientsBase>(effectiveInitialMacros);
  
  // État pour suivre si l'utilisateur a fait des mises à jour manuelles
  const [userUpdates, setUserUpdates] = useState(false);
  
  // État pour le ratio des macronutriments
  const [ratio, setRatio] = useState<{
    protein: number;
    carbs: number;
    fat: number;
  }>({
    protein: 30, // Pourcentage des calories pour les protéines
    carbs: 40,   // Pourcentage des calories pour les glucides
    fat: 30,     // Pourcentage des calories pour les lipides
  });
  
  // Animation values
  const caloriesAnimation = useSharedValue(initialMacros.calories);
  const proteinAnimation = useSharedValue(initialMacros.protein);
  const carbsAnimation = useSharedValue(initialMacros.carbs);
  const fatAnimation = useSharedValue(initialMacros.fat);

  // Mettre à jour les macros quand les valeurs MCP sont chargées
  useEffect(() => {
    if (useMcpMode && !mcpLoading && !mcpError && normalizedNutrition) {
      setMacros(normalizedNutrition);
    }
  }, [useMcpMode, mcpLoading, mcpError, normalizedNutrition]);

  // Mettre à jour les animations quand les macros changent
  useEffect(() => {
    caloriesAnimation.value = withTiming(macros.calories, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    proteinAnimation.value = withTiming(macros.protein, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    carbsAnimation.value = withTiming(macros.carbs, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    fatAnimation.value = withTiming(macros.fat, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [macros]);
  
  // Styles animés
  const caloriesStyle = useAnimatedStyle(() => {
    return {
      fontSize: interpolate(
        caloriesAnimation.value,
        [0, 1000, 3000],
        [14, 16, 22]
      ),
      color: caloriesAnimation.value > 2500 ? '#f59e0b' : '#10b981',
    };
  });
  
  // Options de ratio prédéfinies
  const ratioPresets = [
    { name: "Équilibré", protein: 30, carbs: 40, fat: 30 },
    { name: "Prise de masse", protein: 25, carbs: 55, fat: 20 },
    { name: "Cétogène", protein: 25, carbs: 5, fat: 70 },
    { name: "Sportif", protein: 35, carbs: 45, fat: 20 },
    { name: "Low-carb", protein: 35, carbs: 25, fat: 40 },
  ];
  
  // Vérifier si les ratios actuels sont équilibrés
  const isBalanced = () => {
    // Vérification simple des ratios de macros
    // Vérifier que les calories correspondent aux macros
    const calculatedCalories = 
      (macros.protein * MacroCalorieFactors.PROTEIN) +
      (macros.carbs * MacroCalorieFactors.CARBS) +
      (macros.fat * MacroCalorieFactors.FAT);
    
    // Tolérance de 5% de différence
    const caloriesDiff = Math.abs(calculatedCalories - macros.calories) / macros.calories;
    return caloriesDiff <= 0.05;
  };

  // Mettre à jour les macros en fonction d'une saisie directe
  const handleInputChange = (
    nutrient: keyof MacroNutrientsBase,
    value: string
  ) => {
    try {
      const numericValue = parseFloat(value) || 0;
      
      // Limiter les valeurs à des nombres positifs
      const sanitizedValue = Math.max(0, numericValue);
      
      // Mise à jour des macros
      const updatedMacros = { ...macros, [nutrient]: sanitizedValue };
      
      // Si on modifie les calories, recalculer les macros en fonction du ratio
      if (nutrient === 'calories') {
        setMacros(updatedMacros);
        // Utiliser directement le nutritionEngine pour recalculer les macros à partir des calories
        const result = nutritionEngine.normalizeForDisplay(
          {
            calories: sanitizedValue,
            protein: 0,
            carbs: 0,
            fat: 0,
            unit: macros.unit
          },
          100,
          NutritionDisplayMode.AS_IS
        );
        
        // Extraire les macros normalisées
        const normalizedMacros = result.normalizedMacros || {
          calories: sanitizedValue,
          protein: 0,
          carbs: 0,
          fat: 0,
          unit: macros.unit
        };
        const { protein, carbs, fat } = normalizedMacros;
        
        // Calculer les macros en fonction du ratio
        const calculatedMacros = {
          calories: sanitizedValue,
          protein: (sanitizedValue * (ratio.protein / 100)) / MacroCalorieFactors.PROTEIN,
          carbs: (sanitizedValue * (ratio.carbs / 100)) / MacroCalorieFactors.CARBS,
          fat: (sanitizedValue * (ratio.fat / 100)) / MacroCalorieFactors.FAT,
          unit: macros.unit
        };
        
        // Mettre à jour en préservant les unités
        setMacros({
          ...calculatedMacros,
          unit: macros.unit
        });
      } else {
        // Pour les autres nutriments, recalculer les calories
        // Calculer les calories à partir des macros manuellement
        const updatedCalories = 
          (updatedMacros.protein * MacroCalorieFactors.PROTEIN) +
          (updatedMacros.carbs * MacroCalorieFactors.CARBS) +
          (updatedMacros.fat * MacroCalorieFactors.FAT);
        
        setMacros({
          ...updatedMacros,
          calories: Math.round(updatedCalories)
        });
        
        // Mettre à jour les ratios
        const newTotal = 
          (updatedMacros.protein * MacroCalorieFactors.PROTEIN) +
          (updatedMacros.carbs * MacroCalorieFactors.CARBS) +
          (updatedMacros.fat * MacroCalorieFactors.FAT);
        
        if (newTotal > 0) {
          // Calculer les nouveaux ratios
          const proteinCal = updatedMacros.protein * MacroCalorieFactors.PROTEIN;
          const carbsCal = updatedMacros.carbs * MacroCalorieFactors.CARBS;
          const fatCal = updatedMacros.fat * MacroCalorieFactors.FAT;
          
          const updatedRatio = {
            protein: Math.round((proteinCal / newTotal) * 100),
            carbs: Math.round((carbsCal / newTotal) * 100),
            fat: Math.round((fatCal / newTotal) * 100)
          };
          
          // Assurer que le total fait 100%
          const total = updatedRatio.protein + updatedRatio.carbs + updatedRatio.fat;
          if (total !== 100) {
            // Ajuster le ratio des glucides pour atteindre 100%
            updatedRatio.carbs += (100 - total);
          }
          
          setRatio(updatedRatio);
          setUserUpdates(true);
        }
      }
      
      // Notifier le parent du changement
      if (onAdjust) {
        onAdjust(updatedMacros);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des macros:', error);
    }
  };

  // Appliquer un ratio prédéfini
  const applyRatioPreset = (preset: typeof ratioPresets[0]) => {
    if (locked) return;
    
    setRatio({
      protein: preset.protein,
      carbs: preset.carbs,
      fat: preset.fat
    });
    
    // Recalculer les macros avec le nouveau ratio
    const newMacros = {
      calories: macros.calories,
      protein: (macros.calories * (preset.protein / 100)) / MacroCalorieFactors.PROTEIN,
      carbs: (macros.calories * (preset.carbs / 100)) / MacroCalorieFactors.CARBS,
      fat: (macros.calories * (preset.fat / 100)) / MacroCalorieFactors.FAT,
      unit: macros.unit
    };
    
    setMacros(newMacros);
    setUserUpdates(true);
    
    if (onAdjust) onAdjust(newMacros);
  };
  
  // Mettre à jour les calories et recalculer les macros en fonction du ratio
  const updateCaloriesAndMacros = (calories: number) => {
    // Calculer les nouveaux macros en fonction des calories et du ratio actuel
    const newMacros = {
      calories: calories,
      protein: (calories * (ratio.protein / 100)) / MacroCalorieFactors.PROTEIN,
      carbs: (calories * (ratio.carbs / 100)) / MacroCalorieFactors.CARBS,
      fat: (calories * (ratio.fat / 100)) / MacroCalorieFactors.FAT,
      unit: macros.unit
    };
    
    setMacros(newMacros);
    setUserUpdates(true);
    
    if (onAdjust) onAdjust(newMacros);
  };
  
  // Mettre à jour individuellement un ratio et recalculer les autres
  const updateRatio = (
    nutrient: 'protein' | 'carbs' | 'fat',
    value: number
  ) => {
    const current = { ...ratio };
    const delta = value - current[nutrient];
    
    // Répartir le delta sur les autres nutriments proportionnellement
    const remainingPercentage = 100 - value;
    const othersSum = 100 - current[nutrient];
    
    let newRatio = {...current, [nutrient]: value};
    
    // Répartir la différence sur les autres nutriments
    const others = Object.keys(current).filter(k => k !== nutrient) as Array<'protein' | 'carbs' | 'fat'>;
    
    if (othersSum > 0 && remainingPercentage > 0) {
      others.forEach(key => {
        const currentValue = current[key];
        const proportion = currentValue / othersSum;
        newRatio[key] = Math.round(remainingPercentage * proportion);
      });
      
      // Vérifier que le total fait 100%
      const total = Object.values(newRatio).reduce((sum, val) => sum + val, 0);
      if (total !== 100) {
        // Ajuster le premier non-nutrient pour obtenir 100%
        newRatio[others[0]] += (100 - total);
      }
    } else {
      // Si un nutriment est à 100%, mettre les autres à 0
      others.forEach(key => {
        newRatio[key] = 0;
      });
    }
    
    setRatio(newRatio);
    
    if (userUpdates) {
      // Recalculer les macros avec le nouveau ratio
      const newMacros = {
        calories: macros.calories,
        protein: (macros.calories * (newRatio.protein / 100)) / MacroCalorieFactors.PROTEIN,
        carbs: (macros.calories * (newRatio.carbs / 100)) / MacroCalorieFactors.CARBS,
        fat: (macros.calories * (newRatio.fat / 100)) / MacroCalorieFactors.FAT,
        unit: macros.unit
      };
      
      setMacros(newMacros);
      if (onAdjust) onAdjust(newMacros);
    }
  };
  
  return (
    <Card className={`p-4 ${className}`}>
      <Text className="text-lg font-semibold mb-3">Ajustement Nutritionnel</Text>
      
      {/* Sélection rapide de profils nutritionnels */}
      <VStack className="mb-4">
        <Text className="text-sm font-semibold mb-1">Profils nutritionnels</Text>
        <HStack className="flex-wrap gap-2">
          {ratioPresets.map((preset, index) => (
            <Button
              key={index}
              variant="outline"
              size="xs"
              disabled={locked}
              onPress={() => applyRatioPreset(preset)}
            >
              <ButtonText>{preset.name}</ButtonText>
            </Button>
          ))}
        </HStack>
      </VStack>
      
      {/* Calories - valeur globale */}
      <VStack className="mb-4">
        <HStack className="justify-between items-center mb-1">
          <Text className="text-sm font-semibold">Calories</Text>
          <AnimatedText style={caloriesStyle}>{macros.calories} kcal</AnimatedText>
        </HStack>
        
        <HStack className="items-center gap-2">
          <Text className="text-xs w-10">1000</Text>
          <Slider
            value={macros.calories}
            minValue={1000}
            maxValue={3000}
            step={50}
            isDisabled={locked}
            onChange={(value) => updateCaloriesAndMacros(value)}
            className="flex-1"
          />
          <Text className="text-xs w-10">3000</Text>
        </HStack>
        
        <HStack className="mt-2">
          <Box className="flex-1 bg-gray-100 rounded-md px-2 py-1">
            <TextInput
              value={macros.calories.toString()}
              onChangeText={(value) => handleInputChange('calories', value)}
              keyboardType="numeric"
              editable={!locked}
              style={{ height: 40 }}
            />
          </Box>
        </HStack>
      </VStack>
      
      {/* Ajustement de la répartition des macros */}
      <VStack className="mb-4">
        <Text className="text-sm font-semibold mb-1">Répartition des macronutriments</Text>
        
        {/* Protéines */}
        <VStack className="gap-1 mb-3">
          <HStack className="justify-between items-center">
            <Text className="text-sm">Protéines</Text>
            <HStack className="items-center gap-2">
              <Text className="text-xs text-blue-600">{ratio.protein}%</Text>
              <Text className="text-xs text-gray-500">{macros.protein}g</Text>
            </HStack>
          </HStack>
          
          <Slider
            value={ratio.protein}
            minValue={10}
            maxValue={60}
            step={1}
            isDisabled={locked}
            onChange={(value) => updateRatio('protein', value)}
            className="w-full"
          />
        </VStack>
        
        {/* Glucides */}
        <VStack className="gap-1 mb-3">
          <HStack className="justify-between items-center">
            <Text className="text-sm">Glucides</Text>
            <HStack className="items-center gap-2">
              <Text className="text-xs text-amber-600">{ratio.carbs}%</Text>
              <Text className="text-xs text-gray-500">{macros.carbs}g</Text>
            </HStack>
          </HStack>
          
          <Slider
            value={ratio.carbs}
            minValue={5}
            maxValue={70}
            step={1}
            isDisabled={locked}
            onChange={(value) => updateRatio('carbs', value)}
            className="w-full"
          />
        </VStack>
      </VStack>
      
      {/* Ajustement manuel des valeurs individuelles */}
      <VStack>
        <Text className="text-sm font-semibold mb-2">Saisie manuelle (g)</Text>
        <HStack className="gap-2">
          <VStack className="flex-1">
            <Text className="text-xs text-center text-blue-600 mb-1">Protéines</Text>
            <Box className="bg-gray-100 rounded-md px-2 py-1">
              <TextInput
                value={macros.protein.toString()}
                onChangeText={(value) => handleInputChange('protein', value)}
                keyboardType="numeric"
                editable={!locked}
                style={{ height: 40, textAlign: 'center' }}
              />
            </Box>
          </VStack>
          
          <VStack className="flex-1">
            <Text className="text-xs text-center text-amber-600 mb-1">Glucides</Text>
            <Box className="bg-gray-100 rounded-md px-2 py-1">
              <TextInput
                value={macros.carbs.toString()}
                onChangeText={(value) => handleInputChange('carbs', value)}
                keyboardType="numeric"
                editable={!locked}
                style={{ height: 40, textAlign: 'center' }}
              />
            </Box>
          </VStack>
          
          <VStack className="flex-1">
            <Text className="text-xs text-center text-green-600 mb-1">Lipides</Text>
            <Box className="bg-gray-100 rounded-md px-2 py-1">
              <TextInput
                value={macros.fat.toString()}
                onChangeText={(value) => handleInputChange('fat', value)}
                keyboardType="numeric"
                editable={!locked}
                style={{ height: 40, textAlign: 'center' }}
              />
            </Box>
          </VStack>
        </HStack>
      </VStack>
    </Card>
  );
};

export default NutritionAdjuster;
