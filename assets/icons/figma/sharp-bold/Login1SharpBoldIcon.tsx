import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Login1SharpBoldIcon component
 */
export const Login1SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M2.78516 12.75H9.28516V11.25H2.78516V12.75Z" fill={color} />
    <Path d="M9.28516 2.25V11.25H15.2452L12.7152 8.73L13.7652 7.66L18.1252 12L13.7652 16.34L12.7152 15.27L15.2452 12.75H9.28516V21.75H21.7152V2.25H9.28516Z" fill={color} />
  </Svg>
);

export default Login1SharpBoldIcon;
