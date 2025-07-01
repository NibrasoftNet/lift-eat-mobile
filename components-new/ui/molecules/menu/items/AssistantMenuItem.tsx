/**
 * AssistantMenuItem - Élément de menu Assistant
 * Extrait du Figma Kit: Nutrio – Calorie Counter App UI Kit
 * node-id=48453:15801
 */

import React from 'react';
import MenuItem from '../MenuItem';
// Utilisation de l'icône BotLight en version regular-bold pour les deux états
// car la version curved-bold n'existe pas dans le projet
import { BotLightRegularBoldIcon } from '../../../../../assets/icons/figma/regular-bold/BotLightRegularBoldIcon';

interface AssistantMenuItemProps {
  isActive?: boolean;
  onPress?: () => void;
}

/**
 * Composant AssistantMenuItem conforme au design Figma
 * Utilisé pour l'élément Assistant du MenuBar
 */
const AssistantMenuItem: React.FC<AssistantMenuItemProps> = ({
  isActive = false,
  onPress,
}) => {
  // Utilise la même icône pour les deux états (actif/inactif) puisque
  // la version curved-bold n'existe pas dans le projet
  return (
    <MenuItem
      icon={BotLightRegularBoldIcon}
      label="Assistant"
      isActive={isActive}
      onPress={onPress}
    />
  );
};

export default AssistantMenuItem;
