import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeOffSharpBrokenIcon component
 */
export const VolumeOffSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M20.8371 14.0593L17.3711 10.5933"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.3721 14.0593L20.8381 10.5933"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.04436 8.39048L12.1704 4.81348H12.9464V19.8385H12.1704L8.04436 16.2625H3.66436C3.66136 13.6385 3.66136 11.0145 3.66436 8.39048"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default VolumeOffSharpBrokenIcon;
