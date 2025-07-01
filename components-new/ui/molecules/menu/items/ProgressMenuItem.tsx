/**
 * ProgressMenuItem - Élément de menu Progress
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=48453:12903
 */

import React from 'react';
import MenuItem from '../MenuItem';
import { ActivityRegularBoldIcon } from '../../../../../assets/icons/figma/regular-bold/ActivityRegularBoldIcon';
import { ActivityCurvedBoldIcon } from '../../../../../assets/icons/figma/curved-bold/ActivityCurvedBoldIcon';
import { ActivityCurvedLightBorderIcon } from '../../../../../assets/icons/figma/curved-light-border/ActivityCurvedLightBorderIcon';

interface ProgressMenuItemProps {
  isActive?: boolean;
  onPress?: () => void;
}

/**
 * Composant ProgressMenuItem conforme au design Figma
 * Utilisé pour l'élément Progress du MenuBar
 */
const ProgressMenuItem: React.FC<ProgressMenuItemProps> = ({
  isActive = false,
  onPress,
}) => {
  // Affiche l'icône curved-bold quand actif, regular-bold sinon
  return (
    <MenuItem
      icon={isActive ? ActivityCurvedBoldIcon : ActivityCurvedLightBorderIcon}
      label="Progress"
      isActive={isActive}
      onPress={onPress}
    />
  );
};

export default ProgressMenuItem;
