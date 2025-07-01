import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownCircleSharpBulkIcon component
 */
export const ArrowDownCircleSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M12.25 2.25C6.874 2.25 2.5 6.624 2.5 12C2.5 17.376 6.874 21.75 12.25 21.75C17.626 21.75 22 17.376 22 12C22 6.624 17.626 2.25 12.25 2.25Z" fill={color} />
    <Path d="M7.72021 10.5551L12.2502 15.1061L16.7802 10.5551L15.7172 9.49707L12.2502 12.9801L8.78322 9.49707L7.72021 10.5551Z" fill={color} />
  </Svg>
);

export default ArrowDownCircleSharpBulkIcon;
