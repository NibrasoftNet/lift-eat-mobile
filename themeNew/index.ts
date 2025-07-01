/**
 * Design System hook personnalisé basé sur les tokens Figma
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit (fileKey: EokifkV4EzLIJ1zaU0nAsJ)
 * Utilisation conforme à l'architecture MCP (couche Presenter uniquement)
 */

import { useColorScheme } from 'react-native';
import { colors } from './colors';
import { spacing, SpacingKeys } from './spacing';
import { radii, RadiiKeys } from './radii';
import { shadows, opacities, ShadowKeys, OpacityKeys } from './shadows';
import { typographyUrbanist } from './typography-urbanist';
import { typographyPlayfair } from './typography-playfair';
import { typographyRoboto } from './typography-roboto';

// Types pour le typage des valeurs retournées par le hook
type ColorKeys = keyof typeof colors;
type TypographyUrbanistKeys = keyof typeof typographyUrbanist;
type TypographyPlayfairKeys = keyof typeof typographyPlayfair;
type TypographyRobotoKeys = keyof typeof typographyRoboto;

// Type de retour complet du hook useTheme
export interface ThemeInterface {
  // Couleurs
  colors: typeof colors;
  color: (key: ColorKeys) => string;

  // Typographie
  typography: {
    urbanist: typeof typographyUrbanist;
    playfair: typeof typographyPlayfair;
    roboto: typeof typographyRoboto;
  };
  textStyle: {
    urbanist: (key: TypographyUrbanistKeys) => typeof typographyUrbanist[TypographyUrbanistKeys];
    playfair: (key: TypographyPlayfairKeys) => typeof typographyPlayfair[TypographyPlayfairKeys];
    roboto: (key: TypographyRobotoKeys) => typeof typographyRoboto[TypographyRobotoKeys];
  };

  // Espacement
  spacing: typeof spacing;
  space: (key: SpacingKeys) => number;

  // Rayons de bordure
  radii: typeof radii;
  radius: (key: RadiiKeys) => number;

  // Ombres et opacités
  shadows: typeof shadows;
  shadow: (key: ShadowKeys) => string;
  opacities: typeof opacities;
  opacity: (key: OpacityKeys) => number;

  // Utilitaires
  isDark: boolean;
}

/**
 * Hook personnalisé pour accéder au Design System Figma
 * Regroupe tous les tokens design (couleurs, typo, espacements, etc.)
 * 
 * @example
 * const theme = useTheme();
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: theme.color('background'),
 *     padding: theme.space('md'),
 *     borderRadius: theme.radius('lg'),
 *     ...theme.shadow('md')
 *   },
 *   title: {
 *     ...theme.textStyle.urbanist('h2'),
 *     color: theme.color('primary')
 *   }
 * });
 */
export const useTheme = (): ThemeInterface => {
  // Détection du mode sombre/clair (sera implémenté dans une version future)
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    // Couleurs
    colors,
    color: (key: ColorKeys) => colors[key],

    // Typographie
    typography: {
      urbanist: typographyUrbanist,
      playfair: typographyPlayfair,
      roboto: typographyRoboto,
    },
    textStyle: {
      urbanist: (key: TypographyUrbanistKeys) => typographyUrbanist[key],
      playfair: (key: TypographyPlayfairKeys) => typographyPlayfair[key],
      roboto: (key: TypographyRobotoKeys) => typographyRoboto[key],
    },

    // Espacement
    spacing,
    space: (key: SpacingKeys) => spacing[key],

    // Rayons de bordure
    radii,
    radius: (key: RadiiKeys) => radii[key],

    // Ombres et opacités
    shadows,
    shadow: (key: ShadowKeys) => shadows[key],
    opacities,
    opacity: (key: OpacityKeys) => opacities[key],

    // Utilitaires
    isDark,
  };
};

// Constantes pour faciliter l'accès direct aux tokens
export const { colors: themeColors } = { colors };
export const { spacing: themeSpacing } = { spacing };
export const { radii: themeRadii } = { radii };
export const { shadows: themeShadows, opacities: themeOpacities } = { shadows, opacities };
export const {
  typographyUrbanist: themeTypographyUrbanist,
  typographyPlayfair: themeTypographyPlayfair,
  typographyRoboto: themeTypographyRoboto,
} = { typographyUrbanist, typographyPlayfair, typographyRoboto };

// Export par défaut pour l'importation directe
export default useTheme;
