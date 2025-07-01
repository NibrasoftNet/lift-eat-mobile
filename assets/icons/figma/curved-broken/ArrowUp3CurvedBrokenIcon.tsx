import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp3CurvedBrokenIcon component
 */
export const ArrowUp3CurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12.002 11.3516V20.3016" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.9623 5.42824C13.1813 4.43124 12.4223 3.69824 11.9923 3.69824C10.7323 3.69824 6.72228 10.0622 7.44228 10.7842C8.16228 11.5062 15.7523 11.5752 16.5423 10.7842C16.8423 10.4832 16.4413 9.39024 15.7583 8.15024" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowUp3CurvedBrokenIcon;
