import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftCircleCurvedLightBorderIcon component
 */
export const ArrowLeftCircleCurvedLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M13.4419 8.52832C13.4419 8.52832 9.95589 10.9203 9.95589 12.0003C9.95589 13.0803 13.4419 15.4703 13.4419 15.4703" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12 2.75C5.063 2.75 2.75 5.063 2.75 12C2.75 18.937 5.063 21.25 12 21.25C18.937 21.25 21.25 18.937 21.25 12C21.25 5.063 18.937 2.75 12 2.75Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowLeftCircleCurvedLightBorderIcon;
