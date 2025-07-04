import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Bag3SharpBrokenIcon component
 */
export const Bag3SharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M16.2695 9.90103V6.67803C16.2695 4.46203 14.4745 2.66703 12.2595 2.66703C10.0445 2.65703 8.24047 4.44403 8.23047 6.66003V6.67803V9.90103" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.282 20.6889C19.371 19.1909 21.5 16.0249 21.5 12.3609V7.42285H3V12.3609C3 17.4699 7.141 21.6109 12.25 21.6109" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Bag3SharpBrokenIcon;
