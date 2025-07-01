import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ChartSharpBulkIcon component
 */
export const ChartSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M2.5 22.2847H22V2.78467H2.5V22.2847Z" fill={color} />
    <Path d="M17.8371 17.7417H16.3371V13.3987H17.8371V17.7417Z" fill={color} />
    <Path d="M13.0011 17.7417H11.5011V7.32666H13.0011V17.7417Z" fill={color} />
    <Path d="M8.16406 17.7417H6.66406V10.2117H8.16406V17.7417Z" fill={color} />
  </Svg>
);

export default ChartSharpBulkIcon;
