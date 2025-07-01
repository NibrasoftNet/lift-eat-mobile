import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSharpBrokenIcon component
 */
export const ArrowLeftSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M17.583 12H19.75" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M5.35059 12H13.7536" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M10.8 5.97998L4.75 12L10.8 18.02" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowLeftSharpBrokenIcon;
