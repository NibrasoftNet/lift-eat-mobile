import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftCurvedBrokenIcon component
 */
export const ArrowLeftCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M16.7275 12.0049H19.5005" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M4.5 12.0049H13.123" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M10.5505 5.97461C10.5505 5.97461 4.50049 9.23461 4.50049 11.9946C4.50049 14.7646 10.5505 18.0246 10.5505 18.0246" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowLeftCurvedBrokenIcon;
