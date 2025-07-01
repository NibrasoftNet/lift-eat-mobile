import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star7SharpBrokenIcon component
 */
export const Star7SharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M7.55 13.947L3 12L7.55 10.053L5.71 5.459L10.3 7.3L12.25 2.75L14.2 7.3L18.79 5.459L16.95 10.053L21.5 12" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.95 13.9468L18.79 18.5408L14.2 16.6998L12.25 21.2498L10.3 16.6998L5.70996 18.5408" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Star7SharpBrokenIcon;
