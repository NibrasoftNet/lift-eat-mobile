import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FolderCurvedBrokenIcon component
 */
export const FolderCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M7.1958 14.7246H16.7888" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.36214 21.0622C4.25414 20.4912 2.39014 18.8182 2.39014 14.0142V7.94923C2.39014 5.50723 3.64014 3.41023 6.01214 2.92323C8.38314 2.43523 10.1851 2.60423 11.6821 3.41123C13.1801 4.21923 12.7511 5.41123 14.2901 6.28723C15.8301 7.16323 18.3071 5.84723 19.9251 7.59223C21.6191 9.42023 21.6101 12.2262 21.6101 14.0142C21.6101 20.8112 17.8031 21.3502 12.0001 21.3502" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default FolderCurvedBrokenIcon;
