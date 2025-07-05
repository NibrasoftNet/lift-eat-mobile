/**
 * Search - Composant de recherche
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=442-3286
 */

import React, { forwardRef, useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from '../../atoms/base/Box';
import Text from '../../atoms/base/Text';
// Importer l'icône de recherche
import { SearchRegularBoldIcon } from '@/assets/icons/figma/regular-bold/SearchRegularBoldIcon';
// Importer l'icône de fermeture (pour effacer la recherche)
import { CloseSquareRegularBoldIcon } from '@/assets/icons/figma/regular-bold/CloseSquareRegularBoldIcon';

// Types pour les états du composant Search
type SearchState = 'default' | 'active' | 'filled' | 'disabled';

interface SearchProps extends Omit<TextInputProps, 'style'> {
  // Configuration
  label?: string;
  placeholder?: string;
  state?: SearchState;
  // Contrôle
  onClear?: () => void;
  // Style
  containerStyle?: StyleProp<ViewStyle>;
  // Thème
  darkMode?: boolean;
}

/**
 * Search - Composant de recherche personnalisable
 * Basé sur les spécifications Figma (node-id=442-3286)
 */
const Search = forwardRef<TextInput, SearchProps>(
  (
    {
      // Configuration
      label,
      placeholder = 'Search',
      state = 'default',
      // Contrôle
      onClear,
      value,
      onChangeText,
      onFocus,
      onBlur,
      // Style
      containerStyle,
      // Thème
      darkMode = false,
      ...rest
    },
    ref,
  ) => {
    const theme = useAppTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [internalState, setInternalState] = useState<SearchState>(state);

    // Mettre à jour l'état interne lorsque l'état externe change
    React.useEffect(() => {
      setInternalState(state);
    }, [state]);

    // Gestion du focus et du blur
    const handleFocus = (e: any) => {
      setIsFocused(true);
      if (internalState === 'default') {
        setInternalState('active');
      }
      if (onFocus) {
        onFocus(e);
      }
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      if (internalState === 'active' && !value) {
        setInternalState('default');
      }
      if (onBlur) {
        onBlur(e);
      }
    };

    // Gestion de la saisie
    const handleChangeText = (text: string) => {
      if (text && internalState !== 'disabled') {
        setInternalState('filled');
      } else if (!text && internalState !== 'disabled') {
        setInternalState(isFocused ? 'active' : 'default');
      }

      if (onChangeText) {
        onChangeText(text);
      }
    };

    // Gestion de l'effacement
    const handleClear = () => {
      if (onClear) {
        onClear();
      }
      if (onChangeText) {
        onChangeText('');
      }
      setInternalState(isFocused ? 'active' : 'default');
    };

    // Déterminer les couleurs selon le thème et l'état
    let backgroundColor = darkMode ? '#1F222A' : '#FAFAFA'; // Valeurs exactes du Figma
    let borderColor = darkMode ? '#181A20' : '#FFFFFF'; // Valeurs exactes du Figma
    let iconColor = darkMode ? '#757575' : '#BDBDBD'; // Valeurs exactes du Figma
    let textColor = darkMode ? 'white' : theme.color('primary');

    switch (internalState) {
      case 'active':
        borderColor = theme.color('primary');
        iconColor = theme.color('primary');
        break;
      case 'filled':
        iconColor = darkMode ? '#757575' : theme.color('primary');
        break;
      case 'disabled':
        backgroundColor = darkMode
          ? 'rgba(31, 34, 42, 0.5)'
          : 'rgba(250, 250, 250, 0.5)';
        iconColor = 'rgba(117, 117, 117, 0.5)';
        break;
    }

    // Déterminer si on doit afficher le bouton d'effacement
    const showClearButton =
      !!value && !!onClear && internalState !== 'disabled';

    return (
      <Box style={containerStyle as ViewStyle}>
        {/* Label */}
        {label && (
          <Text
            variant="caption"
            color={theme.color('blueGrey')}
            mb={theme.space('xs')}
            medium
          >
            {label}
          </Text>
        )}

        {/* Conteneur de recherche */}
        <View
          style={[
            styles.container,
            {
              backgroundColor,
              borderColor,
              borderRadius: 10, // Valeur exacte du Figma
              opacity: internalState === 'disabled' ? 0.7 : 1,
            },
          ]}
        >
          {/* Icône de recherche */}
          <View style={styles.iconContainer}>
            <SearchRegularBoldIcon size={20} color={iconColor} />
          </View>

          {/* Champ de saisie */}
          <TextInput
            ref={ref}
            value={value}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor={iconColor}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={internalState !== 'disabled'}
            style={[
              styles.input,
              {
                color: textColor,
                fontFamily: 'Urbanist', // Police exacte du Figma
                fontSize: 18, // Taille exacte du Figma
              },
            ]}
            {...rest}
          />

          {/* Bouton d'effacement */}
          {showClearButton && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <CloseSquareRegularBoldIcon size={20} color={iconColor} />
            </TouchableOpacity>
          )}
        </View>
      </Box>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 0,
    height: 56, // Hauteur fixe
  },
  iconContainer: {
    paddingLeft: 20, // Padding exact du Figma
    paddingRight: 12, // Espacement exact du Figma
  },
  input: {
    flex: 1,
    padding: 18, // Padding exact du Figma
    paddingLeft: 0, // Pas de padding à gauche car l'icône a déjà un padding
    letterSpacing: 0.2, // Valeur approximative basée sur Figma (1.11% pour fontSize 18)
  },
  clearButton: {
    paddingHorizontal: 20, // Padding exact du Figma
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0, // Remplace height: '100%' par positionnement absolu
    justifyContent: 'center',
  },
});

export default Search;
