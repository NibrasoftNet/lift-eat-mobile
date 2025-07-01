import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftRegularTwotoneIcon component
 */
export const ArrowLeftRegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M4.25 12.2744L19.25 12.2744" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M10.2998 18.2988L4.2498 12.2748L10.2998 6.24976" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowLeftRegularTwotoneIcon;
