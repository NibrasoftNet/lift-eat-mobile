import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * StarSharpBrokenIcon component
 */
export const StarSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M10.13 16.804C8.402 14.471 5.905 12.749 3 12C7.537 10.83 11.08 7.287 12.25 2.75C13.42 7.287 16.963 10.83 21.5 12C16.963 13.17 13.42 16.713 12.25 21.25" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M19 2.75C19 3.898 20.32 5.248 21.499 5.248C20.274 5.248 19 6.585 19 7.747C19 6.578 17.647 5.248 16.502 5.248C17.692 5.248 19 3.898 19 2.75Z" fill={color} />
  </Svg>
);

export default StarSharpBrokenIcon;
