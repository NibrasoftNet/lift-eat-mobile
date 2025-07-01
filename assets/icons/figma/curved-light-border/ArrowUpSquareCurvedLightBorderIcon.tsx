import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSquareCurvedLightBorderIcon component
 */
export const ArrowUpSquareCurvedLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M21.25 12C21.25 5.063 18.937 2.75 12 2.75C5.063 2.75 2.75 5.063 2.75 12C2.75 18.937 5.063 21.25 12 21.25C18.937 21.25 21.25 18.937 21.25 12Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12 7.91394L12 16.0859" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.24805 11.6787C8.24805 11.6787 10.776 7.91471 12 7.91471C13.224 7.91471 15.748 11.6787 15.748 11.6787" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowUpSquareCurvedLightBorderIcon;
