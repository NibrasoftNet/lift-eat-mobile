import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight3SharpBoldIcon component
 */
export const ArrowRight3SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M20.25 10.9998C17.812 10.9998 15.59 8.77884 15.59 6.33984V5.33984H13.59V6.33984C13.59 8.11384 14.368 9.77784 15.589 10.9998H3.25V12.9998H15.589C14.368 14.2218 13.59 15.8858 13.59 17.6598V18.6598H15.59V17.6598C15.59 15.2208 17.812 12.9998 20.25 12.9998H21.25V10.9998H20.25Z" fill={color} />
  </Svg>
);

export default ArrowRight3SharpBoldIcon;
