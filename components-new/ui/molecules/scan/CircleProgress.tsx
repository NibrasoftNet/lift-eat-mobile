import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Circle, G, Svg } from 'react-native-svg';
import { useTheme } from '@/themeNew';
import Text from '@/components-new/ui/atoms/base/Text';
import { useTranslation } from 'react-i18next';

interface CircleProgressProps {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  size?: number;
  strokeWidth?: number;
}

const CircleProgress = ({
  calories,
  carbs,
  protein,
  fat,
  size = 100,
  strokeWidth = 8,
}: CircleProgressProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const getStrokeDashoffset = (value: number) => {
    return circumference - (value / 100) * circumference;
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg style={styles.svg}>
        {/* Fond */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.secondary}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Carbs */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.warning}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={getStrokeDashoffset(carbs)}
          strokeLinecap="round"
        />
        
        {/* Protein */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={getStrokeDashoffset(protein)}
          strokeLinecap="round"
        />
        
        {/* Fat */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.warningDark}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={getStrokeDashoffset(fat)}
          strokeLinecap="round"
        />
      </Svg>
      
      {/* Calories au centre */}
      <View style={styles.caloriesContainer}>
        <Text style={styles.caloriesText}>{calories}</Text>
        <Text style={styles.unitText}>{t('common.kcal')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  caloriesContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caloriesText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  unitText: {
    fontSize: 12,
    color: '#666',
  },
});

export default CircleProgress;
