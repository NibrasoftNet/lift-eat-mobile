import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Setting2SharpLightBorderIcon component
 */
export const Setting2SharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M22.25 12.1388L17.25 20.799H7.25L2.25 12.1388L7.25 3.47852L17.25 3.47852L22.25 12.1388Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Circle cx="12.2507" cy="12.139" r="2.8499" fill={none} stroke={color} />
  </Svg>
);

export default Setting2SharpLightBorderIcon;
