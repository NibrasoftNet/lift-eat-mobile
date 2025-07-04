/**
 * Types for CircularProgress component (node-id=48534-38029)
 * Contient les types pour toutes les variantes du composant CircularProgress :
 * - Step Counter Light (id=48503:28901)
 * - Step Counter Dark (id=48503:28899)
 * - History List Light (id=48506:34705)
 * - History List Dark (id=48506:34903)
 * - History Empty Light (id=48503:28900)
 * - History Empty Dark (id=48503:28898)
 */

export interface CircularProgressBaseProps {
  /** Taille du composant en pixels (valeur par défaut selon Figma: 160) */
  size?: number;
  /** Épaisseur du trait de progression (valeur par défaut selon Figma: 6) */
  strokeWidth?: number;
  /** Mode sombre activé ou non */
  isDarkMode?: boolean;
  /** Style supplémentaire pour le conteneur */
  style?: any;
}

export interface StepCounterProps extends CircularProgressBaseProps {
  /** Nombre de pas actuels */
  steps?: number;
  /** Objectif de pas à atteindre */
  goal?: number;
  /** Afficher le cercle en pointillés ou non */
  showDashedCircle?: boolean;
  /** Couleur de la progression (orange par défaut selon Figma) */
  progressColor?: string;
  /** Angle de départ pour l'arc de progression (en degrés) */
  startAngle?: number;
  /** Épaisseur du cercle en pointillés */
  dashedStrokeWidth?: number;
  /** Dash pattern (par ex. "2 32") pour le cercle pointillé */
  dashedStrokePattern?: string;
  /** Angle d'ouverture du gap en bas (degrés) */
  gapDegrees?: number;
  /** Position verticale de la bordure inférieure pour le placement du bouton play */
  bottomOffset?: number;
}

export interface HistoryListProps extends CircularProgressBaseProps {
  /** Valeur de progression en pourcentage (0-100) */
  progressPercentage?: number;
  /** Texte central à afficher (ex: "450") */
  centerText?: string;
  /** Texte inférieur à afficher (ex: "kcal") */
  bottomText?: string;
  /** Couleur de la progression */
  progressColor?: string;
  /** État vide activé ou non */
  isEmpty?: boolean;
}

export type CircularProgressVariant = 'step-counter' | 'history-list';
