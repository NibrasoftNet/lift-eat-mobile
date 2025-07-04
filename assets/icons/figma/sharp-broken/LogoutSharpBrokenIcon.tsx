import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LogoutSharpBrokenIcon component
 */
export const LogoutSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M13.0494 16.8354V21.4604H2.52539V18.1594" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M2.52539 14.091V2.95996H13.0494V7.58496" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M21.9752 12.2114H8.03516" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M17.3789 16.8064C17.3789 14.4444 19.4599 12.2114 21.9739 12.2114" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M17.3789 7.61523C17.3789 9.97823 19.4599 12.2112 21.9739 12.2112" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default LogoutSharpBrokenIcon;
