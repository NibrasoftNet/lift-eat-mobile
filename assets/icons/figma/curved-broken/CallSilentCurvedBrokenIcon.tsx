import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallSilentCurvedBrokenIcon component
 */
export const CallSilentCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M13.8349 14.0163C16.7059 15.2493 16.9399 10.8123 21.1129 15.8773C23.1409 18.3503 19.6909 20.6433 19.5209 20.7393C18.5239 21.4613 15.4129 22.4273 8.65088 15.7493" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M6.3592 13.3081C1.7732 7.9461 2.6212 5.3771 3.2592 4.4751C3.3542 4.3051 5.6582 0.865101 8.1202 2.8821C12.9712 6.8851 9.1192 7.2671 9.8622 9.8041" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M2.25 21.75L20.75 3.25" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default CallSilentCurvedBrokenIcon;
