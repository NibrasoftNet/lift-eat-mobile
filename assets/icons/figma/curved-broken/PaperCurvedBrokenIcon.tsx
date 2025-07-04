import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperCurvedBrokenIcon component
 */
export const PaperCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M14.2613 15.4502H8.86133" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.2159 11.4385H8.85986" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.995 21.25C18.295 21.25 20.395 18.94 20.395 12C20.395 10.58 20.305 9.35 20.115 8.3L14.445 2.9C13.715 2.8 12.895 2.75 11.995 2.75C5.70498 2.75 3.60498 5.07 3.60498 12C3.60498 17.863 5.10398 20.422 9.36198 21.075" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.8887 5.49414C13.8887 7.35214 15.3947 8.85714 17.2527 8.85714H20.2037" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PaperCurvedBrokenIcon;
