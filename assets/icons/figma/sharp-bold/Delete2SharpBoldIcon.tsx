import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Delete2SharpBoldIcon component
 */
export const Delete2SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M8.57934 6.21467L9.38534 3.76367H15.1163L15.9223 6.21467H8.57934ZM11.5013 17.3497H13.0013V10.8767H11.5013V17.3497ZM17.5013 6.21467L16.2013 2.26367H8.30034L7.00034 6.21467H3.81934L5.33334 22.0137H19.1683L20.6803 6.21467H17.5013Z" fill={color} />
  </Svg>
);

export default Delete2SharpBoldIcon;
