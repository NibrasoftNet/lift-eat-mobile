/**
 * SearchBarWithScanner - Barre de recherche avec scanner pour OpenFoodFacts
 * Basé sur le design Figma node-id=55479-8698
 */

import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { ThemeInterface } from '@/themeNew';
import { Text } from '../../atoms/base';
import { SearchRegularLightOutlineIcon } from '../../../../assets/icons/figma/regular-light-outline/SearchRegularLightOutlineIcon';

import { ScanRegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/ScanRegularBoldIcon';

interface SearchBarWithScannerProps {
  /** Valeur actuelle de la recherche */
  value?: string;
  /** Placeholder à afficher quand le champ est vide */
  placeholder?: string;
  /** Callback appelé lors de la modification du texte */
  onChangeText?: (text: string) => void;
  /** Callback appelé lors du clic sur le bouton scanner */
  onScanPress?: () => void;

}

/**
 * Composant SearchBarWithScanner
 * Barre de recherche avec bouton de scanner pour OpenFoodFacts
 * Conforme au design Figma node-id=55479-8698
 */
const SearchBarWithScanner: React.FC<SearchBarWithScannerProps> = ({
  value = '',
  placeholder = 'Search',
  onChangeText,
  onScanPress,

}) => {
  const theme = useAppTheme();
  const isDark = theme.isDark;
  const styles = React.useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  return (
    <View style={styles.container}>
      {/* Icône de recherche */}
      <View style={styles.searchIconContainer}>
        <SearchRegularLightOutlineIcon width={18} height={18} color={isDark? '#CDCDCD':'#757575'} />
      </View>

      {/* Champ de recherche */}
      <TextInput
        style={[styles.input, { color: isDark? '#FFFFFF':'#212121' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark? '#A1A1A1':'#757575'}
      />

      {/* Bouton scanner pour OpenFoodFacts */}
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={onScanPress}
        activeOpacity={0.7}
        accessibilityLabel="Scanner un code-barres avec OpenFoodFacts"
      >
        <ScanRegularBoldIcon width={22} height={22} color={isDark? '#CDCDCD':'#757575'} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: ThemeInterface, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 48,
      borderRadius: 12,
      borderWidth: 1,
      paddingHorizontal: 12,
      marginBottom: 16,
      backgroundColor: theme.colors.background,
      borderColor: isDark ? '#35383F' : '#EEEEEE',
    },
    searchIconContainer: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      height: '100%',
      fontSize: 14,
      fontFamily: 'Urbanist',
    },
    actionButton: {
      padding: 6,
      position: 'relative',
      marginLeft: 8,
    },
  });

export default SearchBarWithScanner;
