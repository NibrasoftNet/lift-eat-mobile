import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShieldDoneSharpBoldIcon component
 */
export const ShieldDoneSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M11.5278 14.2448L8.57584 11.2878L9.63784 10.2278L11.5288 12.1228L15.4258 8.22377L16.4868 9.28377L11.5278 14.2448ZM3.88184 3.09277V12.6428C3.88184 19.5028 12.0238 22.0468 12.1058 22.0718L12.2508 22.1158L12.3958 22.0718C12.4778 22.0468 20.6178 19.5028 20.6178 12.6428V3.09277H3.88184Z" fill={color} />
  </Svg>
);

export default ShieldDoneSharpBoldIcon;
