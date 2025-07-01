import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSquareSharpBrokenIcon component
 */
export const ArrowLeftSquareSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M8.90918 11.9604H16.3392" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.9292 8.2124L8.15918 11.9604L11.9292 15.7084" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M18.073 21.25H21.5V2.75H3V21.25H12.847" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowLeftSquareSharpBrokenIcon;
