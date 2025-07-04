import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShowCurvedBrokenIcon component
 */
export const ShowCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12.0004 8.83789C13.7464 8.83789 15.1624 10.2529 15.1624 11.9999C15.1624 13.7459 13.7464 15.1619 12.0004 15.1619C10.2544 15.1619 8.83838 13.7459 8.83838 11.9999C8.83838 11.4289 8.98938 10.8939 9.25438 10.4309" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.666 18.5972C18.952 17.3012 21.252 14.4462 21.252 12.0002C21.252 8.71724 17.109 4.69824 12 4.69824C6.89005 4.69824 2.74805 8.72024 2.74805 12.0002C2.74805 15.2802 6.89005 19.3022 12 19.3022" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ShowCurvedBrokenIcon;
