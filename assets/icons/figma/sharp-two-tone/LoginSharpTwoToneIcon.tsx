import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LoginSharpTwoToneIcon component
 */
export const LoginSharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M9.3042 7.51367L9.3042 2.88867L20.733 2.88867L20.733 21.3887L9.3042 21.3887L9.3042 16.7637" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M17.7065 12.1387L3.76727 12.1387" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.1108 16.7342C13.1108 14.3717 15.1914 12.1387 17.7064 12.1387" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.1108 7.54316C13.1108 9.90564 15.1914 12.1387 17.7064 12.1387" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default LoginSharpTwoToneIcon;
