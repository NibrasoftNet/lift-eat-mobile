import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSharpBulkIcon component
 */
export const ArrowRightSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M3.54102 13L19.9413 13L19.9413 11L3.54102 11L3.54102 13Z" fill={color} />
    <Path d="M12.0771 5.97866L18.1241 12.0007L12.0771 18.0217L13.4883 19.4389L20.9586 12.0008L13.4884 4.56152L12.0771 5.97866Z" fill={color} />
  </Svg>
);

export default ArrowRightSharpBulkIcon;
