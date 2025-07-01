import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShieldFailSharpBrokenIcon component
 */
export const ShieldFailSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M14.1558 13.624L10.3018 9.77002" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M10.3018 13.624L14.1558 9.77002" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.79481 3.604H4.38281V12.654C4.38281 19.222 12.2508 21.604 12.2508 21.604C12.2508 21.604 20.1178 19.222 20.1178 12.654V3.604H12.4578" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ShieldFailSharpBrokenIcon;
