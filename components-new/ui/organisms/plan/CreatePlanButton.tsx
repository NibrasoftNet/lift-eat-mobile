import React from 'react';
import { GestureResponderEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Button from '../../atoms/inputs/Button';
import { useTheme } from '@/themeNew';

export interface CreatePlanButtonProps {
  /** Callback déclenché au clic */
  onPress?: () => void;
  /** Libellé du bouton. Par défaut « Créer un plan ». */
  label?: string;
}

/**
 * CreatePlanButton – bouton CTA vert avec icône « + » (Figma node 55520-1941)
 * Destiné à remplacer l'ancien Fab « New Plan ».
 * Utilise le composant `Button` atom et les tokens du Design System.
 */
const CreatePlanButton: React.FC<CreatePlanButtonProps> = ({ onPress, label = 'Créer un plan' }) => {
  const theme = useTheme();

  // Couleur verte principale définie dans le Design System (successLighter)
  const backgroundColor = theme.color('successLighter');
  const textColor = '#212121';

  // Icône plus (lignes) – même visuel que CircularAddButton
  const PlusIcon = (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M12 6V18" stroke={textColor} strokeWidth={2} strokeLinecap="round" />
      <Path d="M6 12H18" stroke={textColor} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );

  return (
    <Button
      variant="filled"
      size="lg"
      color={backgroundColor}
      textColor={textColor}
      rounded="2xl"
      leftIcon={PlusIcon}
      onPress={onPress}
      style={{ alignSelf: 'stretch' }}
    >
      {label}
    </Button>
  );
};

export default CreatePlanButton;
