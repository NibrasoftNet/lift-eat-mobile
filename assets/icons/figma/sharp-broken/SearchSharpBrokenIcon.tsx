import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SearchSharpBrokenIcon component
 */
export const SearchSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M18.8848 18.856L21.2908 21.25" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M3.20996 10.789C3.20996 6.349 6.80896 2.75 11.249 2.75C15.688 2.75 19.287 6.349 19.287 10.789C19.287 15.229 15.688 18.828 11.249 18.828C8.33596 18.828 5.78496 17.279 4.37496 14.96" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default SearchSharpBrokenIcon;
