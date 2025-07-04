import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../../themeNew';

interface TitleDividerProps {
  title: string;
  isDarkMode?: boolean;
}

const TitleDivider: React.FC<TitleDividerProps> = ({
  title,
  isDarkMode = false,
}) => {
  const theme = useTheme();
  
  // Couleurs exactes du design Figma
  const textColor = '#9E9E9E'; // Gris moyen pour le texte
  const lineColor = '#EEEEEE'; // Gris clair pour la ligne
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>
        {title}
      </Text>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 16,
    width: '100%',
  },
  title: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22.4, // 1.6 * 14
    letterSpacing: 0.2, // 1.428% * 14
    textAlign: 'left',
  },
  line: {
    flex: 1,
    height: 1,
  },
});

export default TitleDivider;
