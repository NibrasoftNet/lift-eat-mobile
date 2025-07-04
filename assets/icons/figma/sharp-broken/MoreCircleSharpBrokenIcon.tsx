import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreCircleSharpBrokenIcon component
 */
export const MoreCircleSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M18.0315 21.7847C16.1155 21.7847 14.5625 20.2317 14.5625 18.3157C14.5625 16.4007 16.1165 14.8477 18.0315 14.8477C19.9475 14.8477 21.5005 16.3997 21.5005 18.3157" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M6.469 14.8472C8.384 14.8472 9.938 16.4002 9.938 18.3162C9.938 20.2312 8.384 21.7842 6.469 21.7842C4.553 21.7842 3 20.2312 3 18.3162C3 16.4002 4.553 14.8472 6.469 14.8472Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.2503 3.28467C14.1653 3.28467 15.7193 4.83767 15.7193 6.75367C15.7193 8.66867 14.1653 10.2217 12.2503 10.2217C10.3343 10.2217 8.78125 8.66867 8.78125 6.75367" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default MoreCircleSharpBrokenIcon;
