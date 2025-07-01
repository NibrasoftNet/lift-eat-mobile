import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSquareSharpBoldIcon component
 */
export const ArrowLeftSquareSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M17.09 12.75H9.978L12.99 15.745L11.933 16.809L7.097 12L11.933 7.191L12.99 8.255L9.978 11.25H17.09V12.75ZM2.5 21.75H22V2.25H2.5V21.75Z" fill={color} />
  </Svg>
);

export default ArrowLeftSquareSharpBoldIcon;
