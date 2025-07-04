import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star3SharpTwoToneIcon component
 */
export const Star3SharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M13.4992 6.12583L12.25 2.75L9.75166 9.50166L3 12L9.75166 14.4983L11.0008 17.8742" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.4993 6.12598L14.7485 9.50181L21.5001 12.0001L14.7485 14.4985L12.2501 21.2501L11.001 17.8743" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Star3SharpTwoToneIcon;
