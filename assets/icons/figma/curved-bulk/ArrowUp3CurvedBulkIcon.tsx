import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp3CurvedBulkIcon component
 */
export const ArrowUp3CurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M13.2471 11.9598V20.1768C13.2471 20.7298 12.8001 21.1768 12.2471 21.1768C11.6941 21.1768 11.2471 20.7298 11.2471 20.1768V11.9658L13.2471 11.9598Z" fill={color} />
    <Path d="M17.3383 11.1878C16.8033 11.7238 14.9913 11.9088 13.2463 11.9588L11.2463 11.9648C9.00931 11.9118 7.63931 11.6518 7.17531 11.1878C6.61231 10.6238 6.90131 9.68384 7.21531 8.92784C7.86631 7.35884 10.6123 2.82284 12.2573 2.82284C13.9523 2.82284 16.6893 7.56084 17.2863 8.99984C17.6113 9.78184 17.8713 10.6528 17.3383 11.1878Z" fill={color} />
  </Svg>
);

export default ArrowUp3CurvedBulkIcon;
