import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCircleCurvedLightBorderIcon component
 */
export const ArrowUpCircleCurvedLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M21.2495 12C21.2495 5.063 18.9365 2.75 11.9995 2.75C5.06251 2.75 2.74951 5.063 2.74951 12C2.74951 18.937 5.06251 21.25 11.9995 21.25C18.9365 21.25 21.2495 18.937 21.2495 12Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.4712 13.4414C15.4712 13.4414 13.0792 9.95541 11.9992 9.95541C10.9192 9.95541 8.52919 13.4414 8.52919 13.4414" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowUpCircleCurvedLightBorderIcon;
