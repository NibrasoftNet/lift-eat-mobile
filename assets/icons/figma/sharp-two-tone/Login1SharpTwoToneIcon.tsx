import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Login1SharpTwoToneIcon component
 */
export const Login1SharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M16.185 12.0003L3.40723 12.0003" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.6455 15.2749L16.9351 11.9999L13.6455 8.72385" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M9.66406 7.375L9.66406 2.75L21.0929 2.75L21.0929 21.25L9.66406 21.25L9.66406 16.625" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Login1SharpTwoToneIcon;
