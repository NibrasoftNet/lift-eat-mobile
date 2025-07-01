import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlusSharpBrokenIcon component
 */
export const PlusSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M12.25 8.8623V16.1883" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.917 12.5254H8.58398" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M21.5 14.6477V3.28467H3V21.7847H21.5V18.6937" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PlusSharpBrokenIcon;
