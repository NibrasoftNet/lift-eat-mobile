/**
 * Déclaration de types pour react-native-liquid-progress
 * Créé pour résoudre l'erreur TypeScript
 */

declare module 'react-native-liquid-progress' {
  import { ComponentType } from 'react';
  import { ViewStyle } from 'react-native';

  export interface AnimatedLiquidProgressProps {
    /**
     * Taille du composant
     */
    size: number;

    /**
     * Valeur de progression (0-100)
     */
    value: number;

    /**
     * Couleur d'arrière-plan
     */
    backgroundColor?: string;

    /**
     * Couleur de la vague avant
     */
    frontWaveColor?: string;

    /**
     * Couleur de la vague arrière
     */
    backWaveColor?: string;

    /**
     * Durée de l'animation en ms
     */
    duration?: number;

    /**
     * Styles supplémentaires
     */
    style?: ViewStyle;
  }

  export const AnimatedLiquidProgress: ComponentType<AnimatedLiquidProgressProps>;
}
