/**
 * Keyboard - Composant de clavier virtuel
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=2766-23996
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Dimensions,
  Platform,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import { Box, Text } from '../../atoms/base';

import { ArrowLeftRegularBoldIcon } from '@/assets/icons/figma/regular-bold/ArrowLeftRegularBoldIcon';

// Types pour les variantes du composant Keyboard
type KeyboardType = 'numeric' | 'alphabetic';

interface KeyboardProps {
  // Style
  type?: KeyboardType;
  dark?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  keyStyle?: StyleProp<ViewStyle>;
  keyTextStyle?: StyleProp<TextStyle>;
  // Contrôle
  onKeyPress?: (key: string) => void;
  onDelete?: () => void;
  onDone?: () => void;
}

// Définition des touches pour le clavier numérique
const numericKeys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'delete'],
];

// Définition des touches pour le clavier alphabétique (simplifié)
const alphabeticKeys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'delete'],
  ['123', 'space', 'return'],
];

/**
 * Keyboard - Composant de clavier virtuel avec différents types et thèmes
 * Basé sur les spécifications Figma (node-id=2766-23996)
 */
const Keyboard: React.FC<KeyboardProps> = ({
  // Style
  type = 'numeric',
  dark = false,
  containerStyle,
  keyStyle,
  keyTextStyle,
  // Contrôle
  onKeyPress,
  onDelete,
  onDone,
}) => {
  const appTheme = useAppTheme();
  const screenWidth = Dimensions.get('window').width;

  // Couleurs selon le thème
  const backgroundColor = dark ? '#1F222A' : '#FAFAFA'; // Couleurs exactes du Figma
  const keyBackgroundColor = dark ? '#35383F' : '#FFFFFF'; // Couleurs exactes du Figma
  const textColor = dark ? '#FFFFFF' : '#212121'; // Couleurs exactes du Figma
  const specialKeyColor = dark ? '#35383F' : '#EEEEEE'; // Couleurs exactes du Figma
  const borderColor = dark ? '#35383F' : '#E0E0E0'; // Couleurs exactes du Figma

  // Gérer l'appui sur une touche
  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      onDelete && onDelete();
    } else if (key === 'return') {
      onDone && onDone();
    } else if (key === 'shift' || key === '123') {
      // Ces touches changeraient normalement le mode du clavier
      // mais nous ne gérons pas cette fonctionnalité ici
    } else if (key === 'space') {
      onKeyPress && onKeyPress(' ');
    } else {
      onKeyPress && onKeyPress(key);
    }
  };

  // Rendre une touche du clavier numérique
  const renderNumericKey = (key: string, index: number, rowIndex: number) => {
    const isSpecialKey = key === 'delete';
    const keyWidth = (screenWidth - 48) / 3; // 3 touches par ligne, avec marges

    return (
      <TouchableOpacity
        key={`${rowIndex}-${index}`}
        style={[
          styles.numericKey,
          {
            width: keyWidth,
            backgroundColor: isSpecialKey
              ? specialKeyColor
              : keyBackgroundColor,
            borderColor,
          },
          keyStyle,
        ]}
        onPress={() => handleKeyPress(key)}
        activeOpacity={0.7}
      >
        {isSpecialKey ? (
          <ArrowLeftRegularBoldIcon size={24} color={textColor} />
        ) : (
          <Text
            style={[
              styles.keyText,
              {
                color: textColor,
                fontSize: 24, // Taille exacte du Figma
              },
              keyTextStyle as TextStyle,
            ]}
          >
            {key}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  // Rendre une touche du clavier alphabétique
  const renderAlphabeticKey = (
    key: string,
    index: number,
    rowIndex: number,
  ) => {
    const isSpecialKey = ['delete', 'shift', '123', 'space', 'return'].includes(
      key,
    );
    const isSpaceKey = key === 'space';
    const isReturnKey = key === 'return';

    let keyWidth;

    if (rowIndex === 0) {
      // Première ligne: 10 touches égales
      keyWidth = (screenWidth - 20) / 10;
    } else if (rowIndex === 1) {
      // Deuxième ligne: 9 touches égales
      keyWidth = (screenWidth - 18) / 9;
    } else if (rowIndex === 2) {
      // Troisième ligne: touches spéciales aux extrémités
      if (key === 'shift' || key === 'delete') {
        keyWidth = ((screenWidth - 16) / 8) * 1.5; // 1.5x plus large
      } else {
        keyWidth = (screenWidth - 16) / 8;
      }
    } else {
      // Quatrième ligne: touches spéciales
      if (key === 'space') {
        keyWidth = ((screenWidth - 12) / 3) * 1.5; // Barre d'espace plus large
      } else {
        keyWidth = ((screenWidth - 12) / 3) * 0.75;
      }
    }

    return (
      <TouchableOpacity
        key={`${rowIndex}-${index}`}
        style={[
          styles.alphabeticKey,
          {
            width: keyWidth,
            backgroundColor: isSpecialKey
              ? specialKeyColor
              : keyBackgroundColor,
            borderColor,
            height: isSpaceKey || isReturnKey ? 50 : 40, // Hauteur exacte du Figma
          },
          keyStyle,
        ]}
        onPress={() => handleKeyPress(key)}
        activeOpacity={0.7}
      >
        {key === 'delete' ? (
          <ArrowLeftRegularBoldIcon size={20} color={textColor} />
        ) : (
          <Text
            style={[
              styles.keyText,
              {
                color: textColor,
                fontSize: isSpecialKey ? 16 : 18, // Taille exacte du Figma
                textTransform: key === 'shift' ? 'none' : 'none',
              },
              keyTextStyle as TextStyle,
            ]}
          >
            {key === 'shift'
              ? '⇧'
              : key === '123'
              ? '123'
              : key === 'space'
              ? ''
              : key === 'return'
              ? 'return'
              : key}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  // Rendre les rangées de touches
  const renderKeyRows = () => {
    const keys = type === 'numeric' ? numericKeys : alphabeticKeys;

    return keys.map((row, rowIndex) => (
      <View key={`row-${rowIndex}`} style={styles.keyRow}>
        {row.map((key, index) =>
          type === 'numeric'
            ? renderNumericKey(key, index, rowIndex)
            : renderAlphabeticKey(key, index, rowIndex),
        )}
      </View>
    ));
  };

  // Rendre l'indicateur Home (barre en bas de l'écran sur iOS)
  const renderHomeIndicator = () => {
    return (
      <View style={styles.homeIndicatorContainer}>
        <View
          style={[
            styles.homeIndicator,
            { backgroundColor: dark ? '#FFFFFF' : '#000000' },
          ]}
        />
      </View>
    );
  };

  return (
    <Box
      style={[
        styles.container,
        {
          backgroundColor,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10, // Espace supplémentaire pour iOS
        },
        containerStyle as ViewStyle,
      ]}
    >
      {renderKeyRows()}
      {renderHomeIndicator()}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Remplace width: '100%' pour éviter les erreurs de conversion
    paddingTop: 12,
    paddingHorizontal: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  numericKey: {
    height: 56, // Hauteur exacte du Figma
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8, // Rayon exact du Figma
    marginHorizontal: 4,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  alphabeticKey: {
    height: 40, // Hauteur exacte du Figma
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6, // Rayon exact du Figma
    marginHorizontal: 1,
    marginVertical: 3,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  keyText: {
    fontFamily: 'Urbanist', // Police exacte du Figma
    fontWeight: '500', // Poids exact du Figma
  },
  homeIndicatorContainer: {
    flex: 1, // Remplace width: '100%' pour éviter les erreurs de conversion
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  homeIndicator: {
    width: 134, // Largeur exacte du Figma
    height: 5, // Hauteur exacte du Figma
    borderRadius: 2.5,
    opacity: 0.5,
  },
});

export default Keyboard;
