import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TicketSharpLightBorderIcon component
 */
export const TicketSharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M13.9605 17.3281V19.2003" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.9605 14.4292V9.96973" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.9605 4.83203V7.07053" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M21.5 19.4001V13.9894C20.3848 13.9894 19.4866 13.1024 19.4866 12.0011C19.4866 10.8997 20.3848 10.0117 21.5 10.0117V4.6001H3V10.0898C4.11525 10.0898 5.01343 10.8997 5.01343 12.0011C5.01343 13.1024 4.11525 13.9894 3 13.9894V19.4001H21.5Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default TicketSharpLightBorderIcon;
