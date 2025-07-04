
import React from 'react';
import Button from '@/components-new/ui/atoms/inputs/Button';
import { ShadowKeys } from '@/themeNew/shadows';

interface DeleteButtonProps {
  /** Callback when the user presses the button */
  onPress?: () => void;
  /** Show a shadow preset defined in themeNew/shadows. Pass `undefined` for none. */
  shadow?: ShadowKeys | undefined;
  /** Override the default label text (defaults to "Yes, Delete") */
  label?: string;
}

/**
 * DeleteButton – pill-shaped confirmation button matching Nutrio design spec
 * Dimensions: 183×58, padding 16, fully rounded, brand green background.
 */
const DeleteButton: React.FC<DeleteButtonProps> = ({
  onPress,
  shadow,
  label = 'Yes, Delete',
}) => {
  return (
    <Button
      variant="filled"
      color="#A1CE50"       /* Surface/Buttons/Brand */
      textColor="#000000"   /* Absolute 900 */
      rounded="round"        /* 1000px pill */
      px={16}
      py={16}
      style={{ width: 183, height: 58 }}
      shadow={shadow}
      onPress={onPress}
    >
      {label}
    </Button>
  );
};

export default DeleteButton;
