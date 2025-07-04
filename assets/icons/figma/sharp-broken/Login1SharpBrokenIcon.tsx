import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Login1SharpBrokenIcon component
 */
export const Login1SharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M16.1852 12H3.40723" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.6465 15.2751L16.9355 12.0001L13.6465 8.72412" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M9.66406 7.375V2.75H21.0931V21.25H9.66406V16.625" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Login1SharpBrokenIcon;
