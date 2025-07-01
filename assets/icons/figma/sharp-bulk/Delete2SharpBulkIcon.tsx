import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Delete2SharpBulkIcon component
 */
export const Delete2SharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M5.33334 22.0138L3.81934 6.21484H20.6803L19.1683 22.0138H5.33334Z" fill={color} />
    <Path d="M8.57949 6.21467L9.38549 3.76367H15.1165L15.9225 6.21467H17.5015L16.2015 2.26367H8.30049L7.00049 6.21467H8.57949Z" fill={color} />
    <Path d="M11.5015 17.3495H13.0015V10.8765H11.5015V17.3495Z" fill={color} />
  </Svg>
);

export default Delete2SharpBulkIcon;
