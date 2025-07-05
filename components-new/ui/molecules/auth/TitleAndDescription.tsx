/**
 * TitleAndDescription - Composant d'en-tête pour les écrans d'authentification
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=40432:39022
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '@/components-new/ui/atoms/base/Text';
import { useAppTheme } from '@/utils/providers/ThemeProvider';

interface TitleAndDescriptionProps {
  title: string;
  description: string;
}

export const TitleAndDescription: React.FC<TitleAndDescriptionProps> = ({
  title,
  description,
}) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    gap: 8,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Urbanist',
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 32 * 1.4, // line-height: 1.4em
    color: '#212121',
  },
  description: {
    fontFamily: 'Urbanist',
    fontWeight: '400',
    fontSize: 18,
    lineHeight: 18 * 1.6, // line-height: 1.6em
    letterSpacing: 18 * 0.0111, // letter-spacing: 1.11%
    color: '#616161',
  },
});

export default TitleAndDescription;
