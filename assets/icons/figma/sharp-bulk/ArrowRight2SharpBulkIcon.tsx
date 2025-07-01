import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight2SharpBulkIcon component
 */
export const ArrowRight2SharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M7.33545 5.00015L15.7497 13.4144L17.1639 12.0002L8.74966 3.58594L7.33545 5.00015Z" fill={color} />
    <Path d="M8.74966 20.4144L17.1639 12.0002L15.7497 10.5859L7.33545 19.0002L8.74966 20.4144Z" fill={color} />
  </Svg>
);

export default ArrowRight2SharpBulkIcon;
