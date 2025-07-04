import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * NotificationCurvedBrokenIcon component
 */
export const NotificationCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M14.3095 20.4531C13.0155 21.8991 10.9965 21.9161 9.68945 20.4531" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.7104 4.63008C15.6734 3.37708 14.1244 2.45508 11.9994 2.45508C7.5654 2.45508 5.6384 6.47008 5.6384 9.12508C5.6384 11.1081 5.9264 10.5251 4.8284 12.9451C3.4874 16.3931 8.8794 17.8031 11.9994 17.8031C15.1184 17.8031 20.5114 16.3931 19.1714 12.9451C18.0724 10.5251 18.3604 11.1081 18.3604 9.12508" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default NotificationCurvedBrokenIcon;
