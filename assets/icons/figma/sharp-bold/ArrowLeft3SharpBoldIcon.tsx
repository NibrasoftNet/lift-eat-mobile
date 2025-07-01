import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft3SharpBoldIcon component
 */
export const ArrowLeft3SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M21.25 10.9998H8.911C10.132 9.77784 10.91 8.11384 10.91 6.33984V5.33984H8.91V6.33984C8.91 8.77884 6.688 10.9998 4.25 10.9998H3.25V12.9998H4.25C6.688 12.9998 8.91 15.2208 8.91 17.6598V18.6598H10.91V17.6598C10.91 15.8858 10.132 14.2218 8.911 12.9998H21.25V10.9998Z" fill={color} />
  </Svg>
);

export default ArrowLeft3SharpBoldIcon;
