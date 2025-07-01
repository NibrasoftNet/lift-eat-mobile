import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown2SharpBoldIcon component
 */
export const ArrowDown2SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M12.2499 16.9139L3.83594 8.49994L5.24994 7.08594L12.2499 14.0859L19.2499 7.08594L20.6639 8.49994L12.2499 16.9139Z" fill={color} />
  </Svg>
);

export default ArrowDown2SharpBoldIcon;
