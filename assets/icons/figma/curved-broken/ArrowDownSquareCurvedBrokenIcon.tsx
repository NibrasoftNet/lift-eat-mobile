import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownSquareCurvedBrokenIcon component
 */
export const ArrowDownSquareCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12 16.0861V7.91406" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.75 12.3213C15.75 12.3213 13.22 16.0853 12 16.0853C10.78 16.0853 8.25 12.3213 8.25 12.3213" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.344 21.006C19.705 20.255 21.25 17.674 21.25 12C21.25 5.063 18.94 2.75 12 2.75C5.06 2.75 2.75 5.063 2.75 12C2.75 18.937 5.06 21.25 12 21.25" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowDownSquareCurvedBrokenIcon;
