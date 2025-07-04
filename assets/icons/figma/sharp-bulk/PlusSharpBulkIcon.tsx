import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlusSharpBulkIcon component
 */
export const PlusSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M2.5 22.2847H22V2.78467H2.5V22.2847Z" fill={color} />
    <Path d="M13 13.2748H16.667V11.7748H13V8.11182H11.5V11.7748H7.83398V13.2748H11.5V16.9388H13V13.2748Z" fill={color} />
  </Svg>
);

export default PlusSharpBulkIcon;
