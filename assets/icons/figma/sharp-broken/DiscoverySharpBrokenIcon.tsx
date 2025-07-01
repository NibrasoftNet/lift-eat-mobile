import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DiscoverySharpBrokenIcon component
 */
export const DiscoverySharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M9.26611 14.9846L10.3371 10.0866L15.2341 9.01562L14.1631 13.9126L9.26611 14.9846Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M3.926 7.96C5.426 4.876 8.589 2.75 12.25 2.75C17.358 2.75 21.5 6.891 21.5 12C21.5 17.108 17.358 21.25 12.25 21.25C7.141 21.25 3 17.108 3 12" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default DiscoverySharpBrokenIcon;
