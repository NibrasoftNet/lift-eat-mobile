import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft3RegularLightBorderIcon component
 */
export const ArrowLeft3RegularLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11.3 12.2512L20.25 12.2512" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.2998 7.25024L3.3628 12.2512L11.2998 17.2522L11.2998 7.25024Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowLeft3RegularLightBorderIcon;
