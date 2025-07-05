import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EmojiSharpTwoToneIcon component
 */
export const EmojiSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M16.4976 12.6899C16.4976 15.036 14.5958 16.9378 12.2498 16.9378C9.90378 16.9378 8.00195 15.036 8.00195 12.6899"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Circle cx="12.25" cy="12.1387" r="9.25" fill={none} stroke={color} />
  </Svg>
);

export default EmojiSharpTwoToneIcon;
