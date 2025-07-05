import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LogoutCurvedBrokenIcon component
 */
export const LogoutCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M21.7653 12.1201H14.7603"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.7271 12.1201H9.72412"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M2.2334 12C2.2334 18.94 2.2334 21.25 9.3344 21.25C14.6644 21.25 16.0044 19.95 16.3344 16.37"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.8384 9.2002L21.7664 12.1202L18.8384 15.0402"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.3345 7.63C16.0045 4.05 14.6645 2.75 9.33452 2.75C3.81052 2.75 2.58352 4.148 2.31152 8.036"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default LogoutCurvedBrokenIcon;
