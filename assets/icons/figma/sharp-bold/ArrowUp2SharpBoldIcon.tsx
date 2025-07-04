import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp2SharpBoldIcon component
 */
export const ArrowUp2SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M19.2499 16.9139L12.2499 9.91394L5.24994 16.9139L3.83594 15.4999L12.2499 7.08594L20.6639 15.4999L19.2499 16.9139Z" fill={color} />
  </Svg>
);

export default ArrowUp2SharpBoldIcon;
