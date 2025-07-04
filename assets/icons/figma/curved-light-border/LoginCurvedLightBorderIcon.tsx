import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LoginCurvedLightBorderIcon component
 */
export const LoginCurvedLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M14.791 12.1211H2.75" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.8643 9.20508L14.7923 12.1211L11.8643 15.0371" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.25879 7.63C7.58879 4.05 8.92879 2.75 14.2588 2.75C21.3598 2.75 21.3598 5.06 21.3598 12C21.3598 18.94 21.3598 21.25 14.2588 21.25C8.92879 21.25 7.58879 19.95 7.25879 16.37" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default LoginCurvedLightBorderIcon;
