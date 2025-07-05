/**
 * Constantes pour les méthodes de cuisson
 * Contient les informations d'affichage et description des méthodes de cuisson
 */

import { CookingMethod } from '@/utils/constants/CookingConstants';

/**
 * Interface pour les informations sur les méthodes de cuisson
 */
export interface CookingMethodInfo {
  method: CookingMethod;
  label: string;
  iconName: string;
  iconComponent: string;
  description: string;
  impact: string;
}

/**
 * Informations sur les méthodes de cuisson et leur impact
 */
export const COOKING_METHODS_INFO: Record<CookingMethod, CookingMethodInfo> = {
  [CookingMethod.RAW]: {
    method: CookingMethod.RAW,
    label: 'Cru',
    iconComponent: 'FontAwesome5',
    iconName: 'apple-alt',
    description: 'Aliments non cuits, préserve tous les nutriments.',
    impact: 'Pas de changement dans les valeurs nutritionnelles.',
  },
  [CookingMethod.BOILED]: {
    method: CookingMethod.BOILED,
    label: 'Bouilli',
    iconComponent: 'FontAwesome5',
    iconName: 'hot-tub',
    description: "Cuisson dans l'eau bouillante.",
    impact:
      "Perte de certains nutriments solubles dans l'eau, réduit légèrement les calories.",
  },
  [CookingMethod.STEAMED]: {
    method: CookingMethod.STEAMED,
    label: 'Vapeur',
    iconComponent: 'FontAwesome5',
    iconName: 'cloud',
    description: "Cuisson à la vapeur d'eau.",
    impact:
      'Préserve mieux les nutriments que bouilli, perte minimale de nutriments.',
  },
  [CookingMethod.FRIED]: {
    method: CookingMethod.FRIED,
    label: 'Frit',
    iconComponent: 'FontAwesome5',
    iconName: 'oil-can',
    description: "Cuisson dans l'huile chaude.",
    impact:
      "Augmente significativement les lipides et calories, absorption d'huile.",
  },
  [CookingMethod.BAKED]: {
    method: CookingMethod.BAKED,
    label: 'Au four',
    iconComponent: 'FontAwesome5',
    iconName: 'thermometer-full',
    description: 'Cuisson au four (chaleur sèche).',
    impact: "Perte modérée d'eau, légère concentration des nutriments.",
  },
  [CookingMethod.GRILLED]: {
    method: CookingMethod.GRILLED,
    label: 'Grillé',
    iconComponent: 'FontAwesome5',
    iconName: 'fire',
    description: 'Cuisson sur grill ou barbecue.',
    impact: 'Perte de graisse pendant la cuisson, peut réduire les calories.',
  },
};
