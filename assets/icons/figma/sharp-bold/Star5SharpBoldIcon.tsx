import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star5SharpBoldIcon component
 */
export const Star5SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M22.5902 9.6789H14.6942L12.2502 2.1709L9.80716 9.6789H1.91016L8.30216 14.3199L5.86016 21.8289L12.2502 17.1879L18.6412 21.8289L16.1982 14.3199L22.5902 9.6789Z" fill={color} />
  </Svg>
);

export default Star5SharpBoldIcon;
