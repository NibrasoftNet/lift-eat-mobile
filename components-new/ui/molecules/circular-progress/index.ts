/**
 * CircularProgress Components (node-id=48534-38029)
 * Implémentation fidèle du design Figma sans aucune adaptation
 */

// Export des composants principaux
export { default as CircularProgressBase } from '../tracking/CircularProgressBase';
export { default as StepCounter } from '../tracking/StepCounter';
export { default as HistoryList } from './HistoryList';

// Export des types
export * from './types';

// Composant par défaut (pour rétrocompatibilité avec l'ancien CircularProgress)
import StepCounter from '../tracking/StepCounter';
export default StepCounter;
