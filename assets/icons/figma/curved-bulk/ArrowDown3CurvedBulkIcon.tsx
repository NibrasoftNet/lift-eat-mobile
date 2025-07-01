import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown3CurvedBulkIcon component
 */
export const ArrowDown3CurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M17.3383 12.8122C16.8033 12.2762 14.9913 12.0912 13.2463 12.0412L11.2463 12.0352C9.00931 12.0882 7.63931 12.3482 7.17531 12.8122C6.61231 13.3762 6.90131 14.3162 7.21531 15.0722C7.86631 16.6412 10.6123 21.1772 12.2573 21.1772C13.9523 21.1772 16.6893 16.4392 17.2863 15.0002C17.6113 14.2182 17.8713 13.3472 17.3383 12.8122Z" fill={color} />
    <Path d="M13.2471 12.0402V3.82324C13.2471 3.27024 12.8001 2.82324 12.2471 2.82324C11.6941 2.82324 11.2471 3.27024 11.2471 3.82324V12.0342L13.2471 12.0402Z" fill={color} />
  </Svg>
);

export default ArrowDown3CurvedBulkIcon;
