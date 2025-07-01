import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ChartSharpBoldIcon component
 */
export const ChartSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M16.337 17.7417H17.837V13.3987H16.337V17.7417ZM11.501 17.7417H13.001V7.32667H11.501V17.7417ZM6.664 17.7417H8.164V10.2117H6.664V17.7417ZM2.5 22.2847H22V2.78467H2.5V22.2847Z" fill={color} />
  </Svg>
);

export default ChartSharpBoldIcon;
