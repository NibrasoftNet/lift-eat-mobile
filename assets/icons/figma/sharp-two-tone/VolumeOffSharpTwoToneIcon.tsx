import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeOffSharpTwoToneIcon component
 */
export const VolumeOffSharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M20.8371 14.0588L17.3711 10.5928M17.3721 14.0588L20.8381 10.5928" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.04441 16.262H3.66351C3.66136 13.6378 3.66136 11.0137 3.66351 8.38946H8.04441L12.1703 4.81299H12.9459V19.8383H12.1703L8.04441 16.262Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default VolumeOffSharpTwoToneIcon;
