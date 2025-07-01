import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCircleRegularLightBorderIcon component
 */
export const ArrowUpCircleRegularLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M21.25 12C21.25 6.892 17.109 2.75 12 2.75C6.892 2.75 2.75 6.892 2.75 12C2.75 17.108 6.892 21.25 12 21.25C17.109 21.25 21.25 17.108 21.25 12Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.4712 13.4423L12.0002 9.95626L8.52919 13.4423" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowUpCircleRegularLightBorderIcon;
