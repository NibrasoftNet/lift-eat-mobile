/**
 * PlanMenuItem - Élément de menu Plan
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=44443:23757
 */

import React from 'react';
import MenuItem from '../MenuItem';
import { DocumentRegularBoldIcon } from '../../../../../assets/icons/figma/regular-bold/DocumentRegularBoldIcon';
import { DocumentCurvedBoldIcon } from '../../../../../assets/icons/figma/curved-bold/DocumentCurvedBoldIcon';
import { DocumentCurvedLightBorderIcon } from '../../../../../assets/icons/figma/curved-light-border/DocumentCurvedLightBorderIcon';

interface PlanMenuItemProps {
  isActive?: boolean;
  onPress?: () => void;
}

/**
 * Composant PlanMenuItem conforme au design Figma
 * Utilisé pour l'élément Plan du MenuBar
 */
const PlanMenuItem: React.FC<PlanMenuItemProps> = ({
  isActive = false,
  onPress,
}) => {
  // Affiche l'icône curved-bold quand actif, regular-bold sinon
  return (
    <MenuItem
      icon={isActive ? DocumentCurvedBoldIcon : DocumentCurvedLightBorderIcon}
      label="Plan"
      isActive={isActive}
      onPress={onPress}
    />
  );
};

export default PlanMenuItem;
