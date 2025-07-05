import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star5SharpBrokenIcon component
 */
export const Star5SharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M6.8102 20.3668L8.8902 13.9748L3.4502 10.0248H10.1702L12.2502 3.63281L14.3302 10.0248"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.3981 10.0249H21.0501L15.6101 13.9749L17.6901 20.3669L12.2501 16.4159L9.70312 18.2659"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Star5SharpBrokenIcon;
