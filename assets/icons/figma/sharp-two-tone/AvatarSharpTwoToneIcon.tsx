import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * AvatarSharpTwoToneIcon component
 */
export const AvatarSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M16.6357 11.313H16.6457"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.18262 11.313H7.19262"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.6863 8.41602L9.77051 14.9092L9.95175 15.2112H13.5445"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Circle cx="12.25" cy="12.1387" r="9.25" fill={none} stroke={color} />
  </Svg>
);

export default AvatarSharpTwoToneIcon;
