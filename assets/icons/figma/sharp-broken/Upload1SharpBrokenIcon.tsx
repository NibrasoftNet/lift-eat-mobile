import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Upload1SharpBrokenIcon component
 */
export const Upload1SharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M12.25 3.23047V16.0085" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.88 10.9946H21.5V21.5186H3V10.9946H7.62" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.98047 5.77045L12.2505 2.48145L15.5305 5.77045" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Upload1SharpBrokenIcon;
