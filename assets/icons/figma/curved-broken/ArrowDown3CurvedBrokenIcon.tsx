import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown3CurvedBrokenIcon component
 */
export const ArrowDown3CurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M13.9623 18.5721C13.1813 19.5691 12.4223 20.3021 11.9923 20.3021C10.7323 20.3021 6.72228 13.9381 7.44228 13.2161C8.16228 12.4941 15.7523 12.4251 16.5423 13.2161C16.8423 13.5171 16.4413 14.6101 15.7583 15.8501" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.002 12.6482V3.69824" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowDown3CurvedBrokenIcon;
