import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LocationCurvedBrokenIcon component
 */
export const LocationCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M9.51074 10.711C9.51074 12.091 10.6297 13.21 12.0097 13.21C13.3917 13.21 14.5107 12.091 14.5107 10.711C14.5107 9.32896 13.3917 8.20996 12.0097 8.20996" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M19.076 13.482C17.872 17.636 14.368 21 12 21C9.102 21 4.5 15.959 4.5 10.599C4.5 6.403 7.857 3 12 3C16.142 3 19.5 6.403 19.5 10.599" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default LocationCurvedBrokenIcon;
