import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BagSharpBulkIcon component
 */
export const BagSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M22.04 7.49854L20.9 21.8585H3.59996L2.45996 7.49854C8.82834 7.49854 14.2656 7.49854 22.04 7.49854Z" fill={color} />
    <Path d="M12.2498 4.71045C10.041 4.71045 8.25049 6.501 8.25049 8.70975V10.5716H6.75049V8.70975C6.75049 5.67257 9.21261 3.21045 12.2498 3.21045C15.287 3.21045 17.7491 5.67257 17.7491 8.70975V10.5716H16.2491V8.70975C16.2491 6.501 14.4585 4.71045 12.2498 4.71045Z" fill={color} />
  </Svg>
);

export default BagSharpBulkIcon;
