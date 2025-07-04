import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreSquareSharpLightBorderIcon component
 */
export const MoreSquareSharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M16.1898 12.5474H16.1988" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.1801 12.5474H12.1891" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.17128 12.5474H8.18028" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M21.5 21.7847L21.5 3.28467L3 3.28467L3 21.7847L21.5 21.7847Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default MoreSquareSharpLightBorderIcon;
