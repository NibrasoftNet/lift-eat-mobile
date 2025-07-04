import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MessageSharpBrokenIcon component
 */
export const MessageSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M18.0539 9.38574L12.2899 14.0697L6.5249 9.38574" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M6.688 21.5347H2.25V3.53467H22.25V21.5347H10.948" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default MessageSharpBrokenIcon;
