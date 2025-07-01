import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VideoSharpBrokenIcon component
 */
export const VideoSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M19.4753 8.4113L22.2503 6.5293V18.5393L17.2563 14.9213" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M5.471 19.4097H2.25V5.65967H16.735V19.4097H9.304" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M9.4082 9.62109H12.6132" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default VideoSharpBrokenIcon;
