import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown2RegularTwotoneIcon component
 */
export const ArrowDown2RegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M19 8.5L12 15.5L5 8.5" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowDown2RegularTwotoneIcon;
