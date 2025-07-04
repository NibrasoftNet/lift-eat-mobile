import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star2SharpBrokenIcon component
 */
export const Star2SharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M7.156 12.1387H3" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.25 2.88867V21.3887" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.274 12.1147L5.70996 18.6797" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M21.5004 12.1387H12.2744" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M18.7913 5.59766L16.1943 8.19466" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M18.791 18.6787L5.70996 5.59766" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Star2SharpBrokenIcon;
