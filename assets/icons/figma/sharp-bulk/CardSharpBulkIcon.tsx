import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CardSharpBulkIcon component
 */
export const CardSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M2.5 19.6684H22V10.6714H2.5V19.6684Z" fill={color} />
    <Path d="M19.327 16.2305H14.352V14.7305H19.327V16.2305Z" fill={color} />
    <Path d="M12.374 16.2305H10.126V14.7305H12.374V16.2305Z" fill={color} />
    <Path d="M2.5 9.1714H22V4.6084H2.5V9.1714Z" fill={color} />
  </Svg>
);

export default CardSharpBulkIcon;
