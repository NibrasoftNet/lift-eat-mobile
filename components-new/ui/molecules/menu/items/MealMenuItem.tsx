/**
 * MealMenuItem - Élément de menu Meal
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=44443:22604
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import MenuItem from '../MenuItem';
import { HomeRegularBoldIcon } from '../../../../../assets/icons/figma/regular-bold/HomeRegularBoldIcon';
import { HomeCurvedBoldIcon } from '../../../../../assets/icons/figma/curved-bold/HomeCurvedBoldIcon';
import { HomeCurvedLightBorderIcon } from '../../../../../assets/icons/figma/curved-light-border/HomeCurvedLightBorderIcon';

interface MealMenuItemProps {
  isActive?: boolean;
  onPress?: () => void;
}

/**
 * Composant MealMenuItem conforme au design Figma
 * Utilisé pour l'élément Meal du MenuBar
 */
const MealMenuItem: React.FC<MealMenuItemProps> = ({
  isActive = false,
  onPress,
}) => {
  // Affiche l'icône curved-bold quand actif, regular-bold sinon
  return (
    <MenuItem
      icon={isActive ? HomeCurvedBoldIcon : HomeCurvedLightBorderIcon}
      label="Meal"
      isActive={isActive}
      onPress={onPress}
    />
  );
};

export default MealMenuItem;
