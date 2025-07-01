import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Chat2SharpBrokenIcon component
 */
export const Chat2SharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M9.748 3.26393C12.862 2.38093 16.35 3.16493 18.798 5.61293C22.404 9.21893 22.397 15.0619 18.798 18.6609C16.943 20.5169 14.501 21.4149 12.075 21.3619C8.779 21.2909 3 21.3429 3 21.3429C3 21.3429 3.051 15.4959 3.048 12.1429C3.046 9.78093 3.946 7.41893 5.752 5.61293" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.0334 12.52H15.9354" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.2995 12.52H12.2005" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.56512 12.52H8.46613" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Chat2SharpBrokenIcon;
