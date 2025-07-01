import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeCircleCurvedBrokenIcon component
 */
export const TimeCircleCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M7.767 20.227C4.787 18.691 2.75 15.583 2.75 12C2.75 6.891 6.892 2.75 12 2.75C17.109 2.75 21.25 6.891 21.25 12C21.25 17.108 17.109 21.25 12 21.25" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.1906 12.7677L11.6606 12.6937V7.84668" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default TimeCircleCurvedBrokenIcon;
