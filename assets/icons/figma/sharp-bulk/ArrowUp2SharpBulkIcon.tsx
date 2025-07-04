import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp2SharpBulkIcon component
 */
export const ArrowUp2SharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M5.25015 16.9146L13.6644 8.50034L12.2502 7.08612L3.83594 15.5003L5.25015 16.9146Z" fill={color} />
    <Path d="M20.6644 15.5003L12.2502 7.08612L10.8359 8.50034L19.2502 16.9146L20.6644 15.5003Z" fill={color} />
  </Svg>
);

export default ArrowUp2SharpBulkIcon;
