import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HeartCurvedBrokenIcon component
 */
export const HeartCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M2.87319 12.4098C1.80019 9.05981 3.05519 4.89481 6.57219 3.76281C8.42219 3.16581 10.7052 3.66381 12.0022 5.45281C13.2252 3.59781 15.5742 3.16981 17.4222 3.76281C20.9382 4.89481 22.2002 9.05981 21.1282 12.4098C19.4582 17.7198 13.6312 20.4858 12.0022 20.4858C10.7912 20.4858 7.28719 18.9908 4.86119 16.0148" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.7402 7.52734C16.9472 7.65134 17.7022 8.60834 17.6572 9.94934" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default HeartCurvedBrokenIcon;
