import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CalendarCurvedLightBorderIcon component
 */
export const CalendarCurvedLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M2.75 12.775C2.75 5.81898 5.069 3.50098 12.024 3.50098C18.98 3.50098 21.299 5.81898 21.299 12.775C21.299 19.731 18.98 22.049 12.024 22.049C5.069 22.049 2.75 19.731 2.75 12.775Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.4286 17.1123H16.4376" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.0292 17.1123H12.0382" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.62148 17.1123H7.63048" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.4286 13.2607H16.4376" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.0292 13.2607H12.0382" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.62148 13.2607H7.63048" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M3.02539 9.32324H21.0334" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.0332 2.0498V5.3118" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.0249 2.0498V5.3118" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default CalendarCurvedLightBorderIcon;
