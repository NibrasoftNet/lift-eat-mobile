import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Logout1SharpBrokenIcon component
 */
export const Logout1SharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M21.0187 12H8.24072" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M18.479 8.7251L21.769 12.0001L18.479 15.2761" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.255 16.625V21.25H2.73096V2.75H13.255V7.375" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Logout1SharpBrokenIcon;
