import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeCircleCurvedTwoToneIcon component
 */
export const TimeCircleCurvedTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M21.25 12C21.25 17.108 17.109 21.25 12 21.25C6.892 21.25 2.75 17.108 2.75 12C2.75 6.891 6.892 2.75 12 2.75C17.109 2.75 21.25 6.891 21.25 12Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.1911 12.7667L11.6611 12.6927V7.8457" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default TimeCircleCurvedTwoToneIcon;
