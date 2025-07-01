import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeSquareSharpBulkIcon component
 */
export const TimeSquareSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M2.5 21.75H22V2.25H2.5V21.75Z" fill={color} />
    <Path d="M11.5 12.4208L15.901 15.0458L16.67 13.7578L13 11.5688V6.88281H11.5V12.4208Z" fill={color} />
  </Svg>
);

export default TimeSquareSharpBulkIcon;
