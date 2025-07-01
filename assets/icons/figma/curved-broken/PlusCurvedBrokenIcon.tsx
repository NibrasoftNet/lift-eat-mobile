import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlusCurvedBrokenIcon component
 */
export const PlusCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12 8.42578V15.5738" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.5779 12H8.42188" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.0002 2.2627C19.3022 2.2627 21.7372 4.6977 21.7372 11.9997C21.7372 19.3017 19.3022 21.7367 12.0002 21.7367C4.69818 21.7367 2.26318 19.3017 2.26318 11.9997C2.26318 6.0297 3.89118 3.3127 8.47518 2.5207" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PlusCurvedBrokenIcon;
