import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight2SharpBoldIcon component
 */
export const ArrowRight2SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M8.74994 20.4139L7.33594 18.9999L14.3359 11.9999L7.33594 4.99994L8.74994 3.58594L17.1639 11.9999L8.74994 20.4139Z" fill={color} />
  </Svg>
);

export default ArrowRight2SharpBoldIcon;
