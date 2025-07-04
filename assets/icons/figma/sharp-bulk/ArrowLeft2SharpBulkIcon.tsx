import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft2SharpBulkIcon component
 */
export const ArrowLeft2SharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M17.1646 5.00015L8.75034 13.4144L7.33612 12.0002L15.7503 3.58594L17.1646 5.00015Z" fill={color} />
    <Path d="M15.7503 20.4144L7.33612 12.0002L8.75034 10.5859L17.1646 19.0002L15.7503 20.4144Z" fill={color} />
  </Svg>
);

export default ArrowLeft2SharpBulkIcon;
