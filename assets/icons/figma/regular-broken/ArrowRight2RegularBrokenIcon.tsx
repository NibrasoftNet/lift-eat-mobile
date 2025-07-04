import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight2RegularBrokenIcon component
 */
export const ArrowRight2RegularBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M7.74411 4.24279C7.41952 4.56431 7.41729 5.08555 7.74634 5.40707L12.6118 10.1717L12.6977 10.2451C13.0266 10.4897 13.4967 10.4642 13.7952 10.1684C13.957 10.0082 14.0395 9.79753 14.0395 9.58794C14.0395 9.37725 13.957 9.16546 13.793 9.00525L8.92756 4.2395L8.84161 4.16609C8.51275 3.92149 8.04267 3.94706 7.74411 4.24279ZM7.67086 18.6783C7.41979 19.001 7.44646 19.4636 7.744 19.7583C8.0697 20.0798 8.59952 20.0809 8.92745 19.7594L16.2535 12.5828L16.3287 12.4987C16.4427 12.3523 16.5 12.1766 16.5 12.0001C16.5 11.7905 16.4175 11.5798 16.2557 11.4196C15.93 11.097 15.4002 11.0959 15.0723 11.4174L7.74623 18.594L7.67086 18.6783Z" fill={color} />
  </Svg>
);

export default ArrowRight2RegularBrokenIcon;
