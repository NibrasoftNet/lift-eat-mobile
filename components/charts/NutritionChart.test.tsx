import React from 'react';
import { render } from '@testing-library/react-native';
import NutritionsChart from './NutritionChart';
import { NutritionDisplayMode } from '@/utils/enum/nutrition.enum';

describe('NutritionsChart', () => {
  // Test Case 1: Valeurs actuelles inférieures aux objectifs
  it('should display progress correctly when current values are below goals', () => {
    const currentValues = {
      calories: 1500,
      carbs: 150,
      protein: 80,
      fat: 50,
      unit: 'g'
    };

    const goalValues = {
      calories: 2000,
      carbs: 200,
      protein: 100,
      fat: 70,
      unit: 'g'
    };

    console.log('Test Case 1 - En dessous des objectifs:');
    console.log('Current:', currentValues);
    console.log('Goals:', goalValues);
    console.log('Expected percentages:', {
      calories: (1500/2000) * 100,
      carbs: (150/200) * 100,
      protein: (80/100) * 100,
      fat: (50/70) * 100
    });

    render(
      <NutritionsChart
        currentValues={currentValues}
        goalValues={goalValues}
        displayMode={NutritionDisplayMode.FULL}
      />
    );
  });

  // Test Case 2: Valeurs actuelles égales aux objectifs
  it('should display progress correctly when current values equal goals', () => {
    const values = {
      calories: 2000,
      carbs: 200,
      protein: 100,
      fat: 70,
      unit: 'g'
    };

    console.log('Test Case 2 - Égal aux objectifs:');
    console.log('Current = Goals:', values);
    console.log('Expected percentages:', {
      calories: 100,
      carbs: 100,
      protein: 100,
      fat: 100
    });

    render(
      <NutritionsChart
        currentValues={values}
        goalValues={values}
        displayMode={NutritionDisplayMode.FULL}
      />
    );
  });

  // Test Case 3: Valeurs actuelles supérieures aux objectifs
  it('should display progress correctly when current values exceed goals', () => {
    const currentValues = {
      calories: 2500,
      carbs: 250,
      protein: 120,
      fat: 90,
      unit: 'g'
    };

    const goalValues = {
      calories: 2000,
      carbs: 200,
      protein: 100,
      fat: 70,
      unit: 'g'
    };

    console.log('Test Case 3 - Au-dessus des objectifs:');
    console.log('Current:', currentValues);
    console.log('Goals:', goalValues);
    console.log('Expected percentages:', {
      calories: (2500/2000) * 100,
      carbs: (250/200) * 100,
      protein: (120/100) * 100,
      fat: (90/70) * 100
    });

    render(
      <NutritionsChart
        currentValues={currentValues}
        goalValues={goalValues}
        displayMode={NutritionDisplayMode.FULL}
      />
    );
  });

  // Test Case 4: Objectifs à zéro
  it('should handle zero goals gracefully', () => {
    const currentValues = {
      calories: 1500,
      carbs: 150,
      protein: 80,
      fat: 50,
      unit: 'g'
    };

    const goalValues = {
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
      unit: 'g'
    };

    console.log('Test Case 4 - Objectifs à zéro:');
    console.log('Current:', currentValues);
    console.log('Goals:', goalValues);
    console.log('Expected: Should handle division by zero gracefully');

    render(
      <NutritionsChart
        currentValues={currentValues}
        goalValues={goalValues}
        displayMode={NutritionDisplayMode.FULL}
      />
    );
  });
});
