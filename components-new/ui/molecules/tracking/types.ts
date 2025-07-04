/**
 * Types pour les composants de tracking
 */

import { StyleProp, ViewStyle } from 'react-native';

// Types pour les composants de CircularProgress
export interface CircularProgressBaseProps {
  size?: number;
  progressPercentage?: number;
  strokeWidth?: number;
  progressColor?: string;
  baseColor?: string;
  startAngle?: number;
}

// Props partagées par tous les composants Tailwind
export interface TailwindProps {
  /** Classes Tailwind personnalisées */
  className?: string;
}

export interface StepCounterProps extends CircularProgressBaseProps {
  steps?: number;
  goal?: number;
  dashedStrokeWidth?: number;
  dashedStrokePattern?: string;
  gapDegrees?: number;
  bottomOffset?: number;
  isDarkMode?: boolean;
  showDashedCircle?: boolean;
  style?: StyleProp<ViewStyle>;
}

// Extension des props pour la version Tailwind
export interface StepCounterTWProps extends StepCounterProps, TailwindProps {
  /** Classes Tailwind pour le contenu central */
  contentClassName?: string;
  /** Classes Tailwind pour l'étiquette */
  labelClassName?: string;
  /** Classes Tailwind pour le bouton de rafraîchissement */
  refreshButtonClassName?: string;
}

export interface HistoryListProps extends CircularProgressBaseProps {
  centerText?: string;
  bottomText?: string;
  isDarkMode?: boolean;
  isEmpty?: boolean;
  style?: StyleProp<ViewStyle>;
}

// Extension des props pour la version Tailwind
export interface HistoryListTWProps extends HistoryListProps, TailwindProps {
  /** Classes Tailwind pour le contenu central */
  contentClassName?: string;
}

// Interface pour le composant WaterIntake
export interface WaterIntakeProps {
  /** Mode d'affichage (sombre ou clair) */
  dark?: boolean;
  /** Quantité actuelle d'eau consommée en mL */
  currentAmount: number;
  /** Objectif quotidien en mL */
  dailyGoal: number;
  /** Pourcentage de remplissage (0-100) */
  fillPercentage?: number;
}

// Extension des props pour la version Tailwind
export interface WaterIntakeTWProps extends WaterIntakeProps, TailwindProps {
  /** Classes Tailwind pour le conteneur de la goutte d'eau */
  dropContainerClassName?: string;
  /** Classes Tailwind pour le conteneur du montant actuel */
  amountContainerClassName?: string;
  /** Classes Tailwind pour le conteneur de l'objectif */
  goalContainerClassName?: string;
}
