import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp2CurvedBrokenIcon component
 */
export const ArrowUp2CurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M17.1187 12.7109C18.2267 14.1939 18.9997 15.4999 18.9997 15.4999" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M5 15.5C5 15.5 9.144 8.5 12 8.5C12.828 8.5 13.764 9.088 14.676 9.924" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowUp2CurvedBrokenIcon;
