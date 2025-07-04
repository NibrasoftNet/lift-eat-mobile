import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSquareSharpLightBorderIcon component
 */
export const ArrowUpSquareSharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M3 2.75H21.5V21.25H3V2.75Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.25 8.6617V16.0859" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.998 11.6777L12.25 7.91373L8.50195 11.6777" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowUpSquareSharpLightBorderIcon;
