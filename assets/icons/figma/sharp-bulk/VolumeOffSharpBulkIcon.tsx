import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeOffSharpBulkIcon component
 */
export const VolumeOffSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M21.6183 10.2671L20.5573 9.20605L18.8243 10.9401L17.0913 9.20605L16.0303 10.2671L17.7643 12.0011L16.0313 13.7331L17.0923 14.7941L18.8243 13.0611L20.5563 14.7941L21.6173 13.7331L19.8853 12.0011L21.6183 10.2671Z" fill={color} />
    <Path d="M7.57757 7.5633H2.88457V8.0633C2.88157 10.6883 2.88157 13.3123 2.88457 15.9373V16.4363H7.57757L11.7036 20.0123H13.1656V3.9873H11.7036L7.57757 7.5633Z" fill={color} />
  </Svg>
);

export default VolumeOffSharpBulkIcon;
