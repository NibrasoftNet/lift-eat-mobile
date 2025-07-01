import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCircleSharpLightBorderIcon component
 */
export const ArrowUpCircleSharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M3 12C3 6.892 7.141 2.75 12.25 2.75C17.358 2.75 21.5 6.892 21.5 12C21.5 17.108 17.358 21.25 12.25 21.25C7.141 21.25 3 17.108 3 12Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.77881 13.4424L12.2498 9.95638L15.7208 13.4424" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowUpCircleSharpLightBorderIcon;
