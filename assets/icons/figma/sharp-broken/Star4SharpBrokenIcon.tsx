import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star4SharpBrokenIcon component
 */
export const Star4SharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M6.726 13.985C5.591 13.166 4.341 12.496 3 12C7.29 10.414 10.66 7.036 12.25 2.75C13.016 4.816 14.196 6.67 15.693 8.215" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M17.8721 10.0854C18.9811 10.8724 20.1981 11.5184 21.5001 12.0004C17.2101 13.5864 13.8401 16.9654 12.2501 21.2504C11.4171 19.0054 10.0961 17.0104 8.41113 15.3904" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Star4SharpBrokenIcon;
