/**
 * ContinueWithDivider - Composant séparateur avec texte pour l'authentification
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=40432:39032
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '@/components-new/ui/atoms/base/Text';
import { useAppTheme } from '@/utils/providers/ThemeProvider';

interface ContinueWithDividerProps {
  text?: string;
}

export const ContinueWithDivider: React.FC<ContinueWithDividerProps> = ({
  text = 'or continue with'
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  text: {
    fontFamily: 'Urbanist',
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 18 * 1.4, // line-height: 1.4em
    color: '#616161',
    textAlign: 'center',
  }
});

export default ContinueWithDivider;
