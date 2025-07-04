import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown3SharpBoldIcon component
 */
export const ArrowDown3SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M17.9098 13.34C16.1358 13.34 14.4708 14.118 13.2498 15.339V3H11.2498V15.339C10.0278 14.118 8.36284 13.34 6.58984 13.34H5.58984V15.34H6.58984C9.02784 15.34 11.2498 17.561 11.2498 20V21H13.2498V20C13.2498 17.561 15.4718 15.34 17.9098 15.34H18.9098V13.34H17.9098Z" fill={color} />
  </Svg>
);

export default ArrowDown3SharpBoldIcon;
