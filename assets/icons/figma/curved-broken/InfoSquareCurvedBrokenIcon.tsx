import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * InfoSquareCurvedBrokenIcon component
 */
export const InfoSquareCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M15.027 21.0599C19.628 20.3779 21.25 17.8119 21.25 12.0029C21.25 5.06593 18.937 2.75293 12 2.75293C5.063 2.75293 2.75 5.06593 2.75 12.0029C2.75 18.7532 4.94013 21.125 11.4497 21.2479" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12 15.8979V12.0029" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.005 8.50293H11.996" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default InfoSquareCurvedBrokenIcon;
