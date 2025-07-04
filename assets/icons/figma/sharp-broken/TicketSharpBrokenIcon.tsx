import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TicketSharpBrokenIcon component
 */
export const TicketSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M13.9609 17.3281V19.2001" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.9609 14.4292V9.97021" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.9609 4.83203V7.07103" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M5.936 4.6001H3V10.0901C4.115 10.0901 5.013 10.9001 5.013 12.0011C5.013 13.1031 4.115 13.9901 3 13.9901V19.4001H21.5V13.9901C20.385 13.9901 19.487 13.1031 19.487 12.0011C19.487 10.9001 20.385 10.0121 21.5 10.0121V4.6001H10.282" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default TicketSharpBrokenIcon;
