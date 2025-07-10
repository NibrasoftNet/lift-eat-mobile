import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeOffCurvedBrokenIcon component
 */
export const VolumeOffCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15.1013 13.3281C14.9853 16.3351 14.4663 17.5421 13.5093 18.2221C12.4713 18.8401 11.4783 18.4371 10.5923 17.8381"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.92518 16.2097C6.84318 15.9597 6.10918 16.1567 5.20518 15.3957C4.19418 14.5367 4.18518 13.0967 4.19418 11.8707C4.18518 10.6447 4.19418 9.2047 5.20518 8.3457"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.33691 7.40546C9.64291 6.97646 11.4779 4.30946 13.5089 5.50846C14.3319 6.09046 14.8149 7.03846 15.0119 9.12346"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.8069 4.32715L4.46289 19.6721"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default VolumeOffCurvedBrokenIcon;
