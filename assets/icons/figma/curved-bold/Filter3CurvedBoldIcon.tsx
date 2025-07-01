import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Filter3CurvedBoldIcon component
 */
export const Filter3CurvedBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M19.273 3.50895C17.778 3.10395 15.574 3.10595 12.518 3.10495H11.979C8.932 3.09395 6.72 3.10395 5.226 3.50895C3.537 3.96695 2.75 4.98295 2.75 6.70495C2.75 8.84295 4.677 10.4809 6.54 12.0649C8.182 13.4589 9.733 14.7779 9.733 16.2029C9.733 19.629 9.733 22.1049 12.253 22.1049C14.767 22.1049 14.767 19.629 14.767 16.2029C14.767 14.7779 16.317 13.4589 17.96 12.0649C19.823 10.4809 21.75 8.84295 21.75 6.70495C21.75 4.98295 20.962 3.96695 19.273 3.50895Z" fill={color} />
  </Svg>
);

export default Filter3CurvedBoldIcon;
