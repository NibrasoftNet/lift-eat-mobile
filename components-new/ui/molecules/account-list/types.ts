/**
 * Types pour AccountListItem (node-id=560:15440)
 * Composant affichant une ligne dans la liste des éléments de compte
 */

import { StyleProp, ViewStyle } from 'react-native';

export interface AccountListItemProps {
  /** Avatar URL ou image source */
  avatar?: string;
  /** Nom de l'utilisateur ou titre de l'élément */
  title: string;
  /** Sous-titre ou information secondaire */
  subtitle?: string;
  /** Texte additionnel sur la droite (ex: date, montant, etc.) */
  rightText?: string;
  /** Affiche une icône de notification ou badge */
  showBadge?: boolean;
  /** Nombre à afficher dans le badge (si applicable) */
  badgeCount?: number;
  /** Affiche une icône de chevron à droite */
  showChevron?: boolean;
  /** Mode sombre activé */
  isDarkMode?: boolean;
  /** Fonction appelée quand l'élément est pressé */
  onPress?: () => void;
  /** Style personnalisé */
  style?: StyleProp<ViewStyle>;
}

export interface BadgeProps {
  /** Nombre à afficher dans le badge */
  count?: number;
  /** Mode sombre activé */
  isDarkMode?: boolean;
  /** Style personnalisé */
  style?: StyleProp<ViewStyle>;
}
