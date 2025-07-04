import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp3SharpBoldIcon component
 */
export const ArrowUp3SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M17.9098 8.66C15.4718 8.66 13.2498 6.439 13.2498 4V3H11.2498V4C11.2498 6.439 9.02784 8.66 6.58984 8.66H5.58984V10.66H6.58984C8.36284 10.66 10.0278 9.882 11.2498 8.661V21H13.2498V8.661C14.4708 9.882 16.1358 10.66 17.9098 10.66H18.9098V8.66H17.9098Z" fill={color} />
  </Svg>
);

export default ArrowUp3SharpBoldIcon;
