import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DownloadSharpBrokenIcon component
 */
export const DownloadSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M16.88 9.19238H21.5V20.6214H9.20898" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M5.044 20.6214H3V9.19238H7.62" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.25 17.5948V3.65576" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.65039 12.9995C10.0204 12.9995 12.2504 15.0795 12.2504 17.5945" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.85 12.9995C14.48 12.9995 12.25 15.0795 12.25 17.5945" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default DownloadSharpBrokenIcon;
