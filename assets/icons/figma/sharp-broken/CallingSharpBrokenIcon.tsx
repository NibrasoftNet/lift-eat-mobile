import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallingSharpBrokenIcon component
 */
export const CallingSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M14.4976 3.354C18.1986 3.765 21.1226 6.685 21.5376 10.386" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.4976 6.89697C16.2686 7.24097 17.6526 8.62597 17.9976 10.397" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M10.2804 14.273C12.0734 16.065 14.0734 16.613 14.0734 16.613L16.9274 14.97L21.5374 18.37C20.6804 19.903 19.5984 20.984 18.0664 21.842C8.91635 22.261 2.10335 11.887 3.05035 6.826C3.91835 5.333 5.03235 4.228 6.52235 3.354L9.76235 7.805L8.11935 10.659" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default CallingSharpBrokenIcon;
