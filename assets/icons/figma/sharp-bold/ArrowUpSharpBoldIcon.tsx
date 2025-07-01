import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSharpBoldIcon component
 */
export const ArrowUpSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M19.6834 10.762L12.2494 3.29102L4.81641 10.762L6.23441 12.173L11.2494 7.13202V20.709H13.2494V7.13202L18.2654 12.173L19.6834 10.762Z" fill={color} />
  </Svg>
);

export default ArrowUpSharpBoldIcon;
