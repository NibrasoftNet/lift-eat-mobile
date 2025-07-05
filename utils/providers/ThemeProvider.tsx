/**
 * ThemeProvider personnalisé basé sur les tokens Figma
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit (fileKey: EokifkV4EzLIJ1zaU0nAsJ)
 * Utilisation conforme à l'architecture MCP (couche Presenter uniquement)
 */

import React, { createContext, useContext, ReactNode } from 'react';
import useTheme, { ThemeInterface } from '@/themeNew';

// Création d'un contexte pour partager les valeurs du thème dans l'arbre de composants
const ThemeContext = createContext<ThemeInterface | undefined>(undefined);

// Props du ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Provider qui rend les tokens design (couleurs, typo, etc.) disponibles à tous les composants
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Utilisation du hook useTheme pour obtenir tous les tokens design
  const theme = useTheme();

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

/**
 * Hook pour accéder facilement au thème dans les composants
 * @example
 * const { color, textStyle, space } = useAppTheme();
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: color('background'),
 *     padding: space('md'),
 *   },
 *   title: {
 *     ...textStyle.urbanist('h1'),
 *     color: color('primary')
 *   }
 * });
 */
export const useAppTheme = (): ThemeInterface => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
