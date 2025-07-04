import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DangerCircleRegularLightBorderIcon component
 */
export const DangerCircleRegularLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12 2.75012C17.108 2.75012 21.25 6.89112 21.25 12.0001C21.25 17.1081 17.108 21.2501 12 21.2501C6.891 21.2501 2.75 17.1081 2.75 12.0001C2.75 6.89112 6.891 2.75012 12 2.75012Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.995 15.7961H12.005" fill={none} stroke={color} strokeWidth="2" />
    <Path d="M11.9951 8.20422V12.6232" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default DangerCircleRegularLightBorderIcon;
