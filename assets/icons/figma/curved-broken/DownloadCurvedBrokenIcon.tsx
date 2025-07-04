import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DownloadCurvedBrokenIcon component
 */
export const DownloadCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11.8799 14.7361V7.86914" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.7995 11.8086L11.8795 14.7366L8.95947 11.8086" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.232 21.2391C4.195 20.9931 2.75 19.8191 2.75 14.2041C2.75 8.8741 4.05 7.5341 7.63 7.2041" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.3695 7.2041C19.9495 7.5341 21.2495 8.8741 21.2495 14.2041C21.2495 21.3041 18.9395 21.3041 11.9995 21.3041" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.8799 4.84331V2.69531" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default DownloadCurvedBrokenIcon;
