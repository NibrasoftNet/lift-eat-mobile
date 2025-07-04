import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreCircleRegularLightBorderIcon component
 */
export const MoreCircleRegularLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12 2.75012C17.108 2.75012 21.25 6.89112 21.25 12.0001C21.25 17.1081 17.108 21.2501 12 21.2501C6.891 21.2501 2.75 17.1081 2.75 12.0001C2.75 6.89212 6.892 2.75012 12 2.75012Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.9393 12.0131H15.9483" fill={none} stroke={color} strokeWidth="2" />
    <Path d="M11.9301 12.0131H11.9391" fill={none} stroke={color} strokeWidth="2" />
    <Path d="M7.92128 12.0131H7.93028" fill={none} stroke={color} strokeWidth="2" />
  </Svg>
);

export default MoreCircleRegularLightBorderIcon;
