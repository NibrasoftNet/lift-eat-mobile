import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSharpBrokenIcon component
 */
export const ArrowRightSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M19.1496 12.0005H10.7466" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M6.91749 12.0005H4.75049" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.6997 5.97998L19.7497 12L13.6997 18.02" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowRightSharpBrokenIcon;
