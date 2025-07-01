import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown3CurvedTwoToneIcon component
 */
export const ArrowDown3CurvedTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11.8998 20.3539C13.1558 20.3539 17.1708 13.9899 16.4488 13.2679C15.7268 12.5459 8.14181 12.4769 7.35081 13.2679C6.55981 14.0599 10.6448 20.3539 11.8998 20.3539Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.894 12.7V3.75" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowDown3CurvedTwoToneIcon;
