import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShieldFailCurvedBrokenIcon component
 */
export const ShieldFailCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M15.3757 20.3993C17.5367 19.1693 19.6727 16.7513 19.6727 12.7003C19.6727 6.29627 19.9507 5.79527 19.3347 5.17927C18.7187 4.56327 15.5097 2.57227 12.0007 2.57227C8.4917 2.57227 5.2817 4.56327 4.6657 5.17927C4.0497 5.79527 4.3277 6.29627 4.3277 12.7003C4.3277 19.1053 9.6657 21.4273 12.0007 21.4273" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.8791 13.6457L10.1201 9.8877" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M10.1201 13.6457L13.8791 9.8877" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ShieldFailCurvedBrokenIcon;
