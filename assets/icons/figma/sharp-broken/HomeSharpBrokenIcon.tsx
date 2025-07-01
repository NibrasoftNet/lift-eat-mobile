import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HomeSharpBrokenIcon component
 */
export const HomeSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M2.18408 11.375L12.2501 2.75L22.3161 11.375" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.562 21.2497H20.16V10.1587" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M4.34277 10.1587V21.2497H12.0818" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.2495 12.7046V16.1126" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default HomeSharpBrokenIcon;
