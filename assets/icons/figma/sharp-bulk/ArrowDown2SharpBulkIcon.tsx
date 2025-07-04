import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown2SharpBulkIcon component
 */
export const ArrowDown2SharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M5.25015 7.08594L13.6644 15.5002L12.2502 16.9144L3.83594 8.50015L5.25015 7.08594Z" fill={color} />
    <Path d="M20.6644 8.50015L12.2502 16.9144L10.8359 15.5002L19.2502 7.08594L20.6644 8.50015Z" fill={color} />
  </Svg>
);

export default ArrowDown2SharpBulkIcon;
