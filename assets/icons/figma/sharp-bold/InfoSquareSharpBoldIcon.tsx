import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * InfoSquareSharpBoldIcon component
 */
export const InfoSquareSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M13 9.48867H11.5L11.49 7.98867H13V9.48867ZM11.494 17.2847H12.994V11.7847H11.494V17.2847ZM2.5 22.2847H22V2.78467H2.5V22.2847Z" fill={color} />
  </Svg>
);

export default InfoSquareSharpBoldIcon;
