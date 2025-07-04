import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreSquareSharpBulkIcon component
 */
export const MoreSquareSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M2.5 22.2847H22V2.78467H2.5V22.2847Z" fill={color} />
    <Path d="M15.4489 13.2979H16.9489V11.7979H15.4399L15.4489 13.2979Z" fill={color} />
    <Path d="M11.4389 13.2979H12.9389V11.7979H11.4299L11.4389 13.2979Z" fill={color} />
    <Path d="M7.4299 13.2979H8.9299V11.7979H7.4209L7.4299 13.2979Z" fill={color} />
  </Svg>
);

export default MoreSquareSharpBulkIcon;
