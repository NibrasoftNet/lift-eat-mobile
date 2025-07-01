import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LoginSharpBoldIcon component
 */
export const LoginSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M8.92499 2.40869V11.4087H14.215C13.165 10.4287 12.485 9.03869 12.485 7.55869V6.80869H13.985V7.55869C13.985 9.57869 15.815 11.4087 17.835 11.4087H18.585V12.9087H17.835C15.815 12.9087 13.985 14.7387 13.985 16.7487V17.4987H12.485V16.7487C12.485 15.2687 13.165 13.8887 14.215 12.9087H8.92499V21.9087H21.355V2.40869H8.92499Z" fill={color} />
    <Path d="M3.14502 12.9087H8.92499V11.4087H3.14502V12.9087Z" fill={color} />
  </Svg>
);

export default LoginSharpBoldIcon;
