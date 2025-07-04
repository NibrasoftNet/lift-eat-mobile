import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star6SharpTwoToneIcon component
 */
export const Star6SharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M15.7832 12L20.2607 16.625L14.0166 15.0598L12.25 21.25L10.4834 15.0598L4.23926 16.625L8.71681 12" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.7832 12L20.2607 7.375L14.0166 8.94017L12.25 2.75L10.4834 8.94017L4.23926 7.375L8.71681 12" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Star6SharpTwoToneIcon;
