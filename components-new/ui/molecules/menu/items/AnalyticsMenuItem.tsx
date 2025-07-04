/**
 * AnalyticsMenuItem - Élément de menu Analytics
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=48453:12930
 */

import React from 'react';
import MenuItem from '../MenuItem';
import { ChartRegularBoldIcon } from '../../../../../assets/icons/figma/regular-bold/ChartRegularBoldIcon';
import { ChartCurvedBoldIcon } from '../../../../../assets/icons/figma/curved-bold/ChartCurvedBoldIcon';
import { ChartCurvedTwoToneIcon } from '../../../../../assets/icons/figma/curved-two-tone/ChartCurvedTwoToneIcon';
import { ChartCurvedLightBorderIcon } from '../../../../../assets/icons/figma/curved-light-border/ChartCurvedLightBorderIcon';
interface AnalyticsMenuItemProps {
  isActive?: boolean;
  onPress?: () => void;
}

/**
 * Composant AnalyticsMenuItem conforme au design Figma
 * Utilisé pour l'élément Analytics du MenuBar
 */
const AnalyticsMenuItem: React.FC<AnalyticsMenuItemProps> = ({
  isActive = false,
  onPress,
}) => {
  // Affiche l'icône curved-bold quand actif, regular-bold sinon
  return (
    <MenuItem
      icon={isActive ? ChartCurvedBoldIcon : ChartCurvedLightBorderIcon}
      label="Analytics"
      isActive={isActive}
      onPress={onPress}
    />
  );
};

export default AnalyticsMenuItem;
