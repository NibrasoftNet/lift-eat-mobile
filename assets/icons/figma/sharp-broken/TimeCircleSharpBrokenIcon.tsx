import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeCircleSharpBrokenIcon component
 */
export const TimeCircleSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M7.909 20.17C4.988 18.615 3 15.54 3 12C3 6.891 7.141 2.75 12.25 2.75C17.359 2.75 21.5 6.891 21.5 12C21.5 17.109 17.359 21.25 12.25 21.25" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.6821 14.9417L11.9121 12.6927V7.8457" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default TimeCircleSharpBrokenIcon;
