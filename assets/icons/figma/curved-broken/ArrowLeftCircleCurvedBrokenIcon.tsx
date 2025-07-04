import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftCircleCurvedBrokenIcon component
 */
export const ArrowLeftCircleCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M15.163 21.036C19.661 20.325 21.25 17.752 21.25 12C21.25 5.063 18.939 2.75 12 2.75C5.06 2.75 2.75 5.063 2.75 12C2.75 18.937 5.06 21.25 12 21.25" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.4395 8.5293C13.4395 8.5293 9.95947 10.9213 9.95947 12.0013C9.95947 13.0813 13.4395 15.4713 13.4395 15.4713" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowLeftCircleCurvedBrokenIcon;
