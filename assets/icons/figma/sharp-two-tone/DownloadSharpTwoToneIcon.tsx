import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DownloadSharpTwoToneIcon component
 */
export const DownloadSharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M16.875 9.19287H21.5V20.6217H3V9.19287H7.625" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.65449 12.9995C10.017 12.9995 12.25 15.0801 12.25 17.595" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.25 17.5952L12.25 3.65594" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.8455 12.9995C14.483 12.9995 12.25 15.0801 12.25 17.595" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default DownloadSharpTwoToneIcon;
