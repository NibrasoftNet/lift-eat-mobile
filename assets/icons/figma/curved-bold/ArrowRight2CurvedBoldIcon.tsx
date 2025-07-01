import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight2CurvedBoldIcon component
 */
export const ArrowRight2CurvedBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M8.75094 19.9995C8.40894 19.9995 8.07594 19.8245 7.88994 19.5095C7.60794 19.0335 7.76594 18.4205 8.23994 18.1395C10.8649 16.5835 14.7499 13.5565 14.7499 11.9995C14.7499 10.4395 10.8659 7.41349 8.23994 5.85949C7.76594 5.57849 7.60794 4.96549 7.88994 4.48949C8.17094 4.01549 8.78394 3.85849 9.25994 4.13949C10.5099 4.87949 16.7499 8.73749 16.7499 11.9995C16.7499 15.2605 10.5109 19.1195 9.25994 19.8595C9.09994 19.9545 8.92394 19.9995 8.75094 19.9995Z" fill={color} />
  </Svg>
);

export default ArrowRight2CurvedBoldIcon;
