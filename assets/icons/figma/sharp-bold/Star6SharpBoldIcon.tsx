import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star6SharpBoldIcon component
 */
export const Star6SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M21.8391 6.46366L14.3671 8.33766L12.2501 0.930664L10.1331 8.33766L2.66113 6.46366L8.02413 12.0007L2.66113 17.5367L10.1331 15.6627L12.2501 23.0697L14.3671 15.6627L21.8391 17.5367L16.4771 12.0007L21.8391 6.46366Z" fill={color} />
  </Svg>
);

export default Star6SharpBoldIcon;
