/**
 * Grid - Composant de système de grille
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=435-5225
 */

import React from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/utils/providers/ThemeProvider';
import Box from './../base/Box';
import Text from './../base/Text';

// Types pour les propriétés du composant Grid
type GridType = 'fluid' | 'fixed';
type GridColumns = 1 | 2 | 3 | 4 | 6 | 12;

interface GridProps {
  // Configuration
  type?: GridType;
  columns?: GridColumns;
  spacing?: number;
  children?: React.ReactNode;
  // Style
  style?: StyleProp<ViewStyle>;
  columnStyle?: StyleProp<ViewStyle>;
  // Options
  showGuides?: boolean;
  guideColor?: string;
}

interface ColProps {
  size?: number; // Nombre de colonnes (1-12)
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * Grid - Composant de mise en page en grille flexible
 * Basé sur les spécifications Figma (node-id=435-5225)
 */
const Grid: React.FC<GridProps> & { Col: React.FC<ColProps> } = ({
  // Configuration
  type = 'fluid',
  columns = 4,
  spacing = 16,
  children,
  // Style
  style,
  columnStyle,
  // Options
  showGuides = false,
  guideColor = 'rgba(229, 94, 117, 0.1)', // Couleur exacte du Figma (#E55E75 avec opacité)
}) => {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();

  // Calculer la largeur disponible pour la grille
  const availableWidth = width;

  // Calculer la largeur des colonnes
  const columnWidth =
    type === 'fluid'
      ? (availableWidth - spacing * (columns - 1)) / columns
      : 24; // Largeur fixe selon Figma pour les colonnes statiques

  // Préparer les guides pour la visualisation
  const renderGuides = () => {
    if (!showGuides) return null;

    // Créer un tableau de guides basé sur le nombre de colonnes
    const guides = [];

    for (let i = 0; i < columns; i++) {
      const left = i * (columnWidth + spacing);

      guides.push(
        <View
          key={i}
          style={[
            styles.guide,
            {
              left,
              width: columnWidth,
              backgroundColor: guideColor,
            },
          ]}
        />,
      );
    }

    return <View style={styles.guideContainer}>{guides}</View>;
  };

  // Permet d'ajouter des propriétés de style de grille aux enfants
  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;

      // Si c'est un Col, on lui passe les propriétés nécessaires
      if (child.type === Grid.Col) {
        return React.cloneElement(child, {
          ...child.props,
          _columnWidth: columnWidth,
          _spacing: spacing,
          _totalColumns: columns,
        });
      }

      return child;
    });
  };

  return (
    <View style={[styles.container, style as ViewStyle]}>
      {/* Guides (optionnels) */}
      {renderGuides()}

      {/* Contenu de la grille */}
      <View style={styles.content}>{renderChildren()}</View>
    </View>
  );
};

/**
 * Grid.Col - Composant de colonne pour le système de grille
 */
const Col: React.FC<
  ColProps & {
    _columnWidth?: number;
    _spacing?: number;
    _totalColumns?: number;
  }
> = ({
  size = 1,
  style,
  children,
  _columnWidth = 0,
  _spacing = 16,
  _totalColumns = 12,
}) => {
  // Calculer la largeur de cette colonne
  const width = size * _columnWidth + (size - 1) * _spacing;

  return (
    <View
      style={[
        styles.column,
        {
          width,
          marginRight: _spacing,
        },
        style as ViewStyle,
      ]}
    >
      {children}
    </View>
  );
};

// Attacher le composant Col au composant Grid
Grid.Col = Col;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1, // Remplace width: '100%' pour éviter les erreurs de conversion
  },
  guideContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 0,
  },
  guide: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0, // Remplace height: '100%' par positionnement absolu
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    zIndex: 1,
  },
  column: {
    marginBottom: 16,
  },
});

export default Grid;
