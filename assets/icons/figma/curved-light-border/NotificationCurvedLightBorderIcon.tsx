import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * NotificationCurvedLightBorderIcon component
 */
export const NotificationCurvedLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M14.306 20.5127C13.0117 21.9584 10.9927 21.9756 9.68604 20.5127" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.9964 2.51465C7.5621 2.51465 5.63543 6.52989 5.63543 9.18417C5.63543 11.168 5.92305 10.5842 4.82496 13.0042C3.484 16.4527 8.87638 17.8623 11.9964 17.8623C15.1154 17.8623 20.5078 16.4527 19.1678 13.0042C18.0697 10.5842 18.3573 11.168 18.3573 9.18417C18.3573 6.52989 16.4297 2.51465 11.9964 2.51465Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default NotificationCurvedLightBorderIcon;
