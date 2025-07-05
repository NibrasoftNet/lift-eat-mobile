import React from 'react';
import Button from '@/components-new/ui/atoms/inputs/Button';
import { ShadowKeys } from '@/themeNew/shadows';

interface CancelButtonProps {
  /** Callback when the user presses the button */
  onPress?: () => void;
  /** Shadow preset (theme token) */
  shadow?: ShadowKeys | undefined;
  /** Override label (default: "Cancel") */
  label?: string;
}

/**
 * CancelButton – pill-shaped secondary button for delete drawer.
 * Dimensions: 183×58, padding 16, fully rounded, subtle light surface background.
 */
const CancelButton: React.FC<CancelButtonProps> = ({
  shadow,
  onPress,
  label = 'Cancel',
}) => {
  return (
    <Button
      variant="filled"
      color="#F7FBF1" /* light surface */
      textColor="#000000"
      rounded="round"
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

export default CancelButton;
