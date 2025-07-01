import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LogoutSharpBoldIcon component
 */
export const LogoutSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M7.16332 11.4087H13.4233V2.40869H1.90332V21.9087H13.4233V12.9087H7.16332V11.4087Z" fill={color} />
    <Path d="M21.8463 11.4088C19.8343 11.4078 18.0023 9.57579 18.0023 7.56279V6.81279H16.5023V7.56279C16.5023 9.03979 17.1773 10.4198 18.2213 11.4088L13.4233 11.4087V12.9087L18.2213 12.9088C17.1773 13.8978 16.5023 15.2768 16.5023 16.7538V17.5038H18.0023V16.7538C18.0023 14.7418 19.8353 12.9088 21.8473 12.9088H22.5973V11.4088H21.8463Z" fill={color} />
  </Svg>
);

export default LogoutSharpBoldIcon;
