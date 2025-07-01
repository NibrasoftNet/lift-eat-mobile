import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft3CurvedBoldIcon component
 */
export const ArrowLeft3CurvedBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M20.4252 11.0001H12.1982C12.1322 9.09213 11.8792 7.37113 11.4362 6.92713C10.8732 6.36413 9.9402 6.65013 9.1882 6.96113C7.6172 7.61113 3.0752 10.3571 3.0752 12.0071C3.0752 13.7101 7.8222 16.4451 9.2632 17.0421C9.7142 17.2291 10.1962 17.3941 10.6242 17.3941C10.9332 17.3941 11.2142 17.3091 11.4372 17.0851C11.8812 16.6391 12.1342 14.9121 12.1992 13.0001H20.4252C20.9782 13.0001 21.4252 12.5531 21.4252 12.0001C21.4252 11.4471 20.9782 11.0001 20.4252 11.0001Z" fill={color} />
  </Svg>
);

export default ArrowLeft3CurvedBoldIcon;
