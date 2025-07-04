import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownSharpBoldIcon component
 */
export const ArrowDownSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M18.2654 11.827L13.2494 16.868V3.29102H11.2494V16.868L6.23441 11.827L4.81641 13.238L12.2494 20.709L19.6834 13.238L18.2654 11.827Z" fill={color} />
  </Svg>
);

export default ArrowDownSharpBoldIcon;
