import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSharpBulkIcon component
 */
export const ArrowUpSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M13.25 20.7085V4.30825H11.25V20.7085H13.25Z" fill={color} />
    <Path d="M6.22866 12.1724L12.2507 6.12536L18.2717 12.1724L19.6889 10.7612L12.2508 3.29094L4.81152 10.7611L6.22866 12.1724Z" fill={color} />
  </Svg>
);

export default ArrowUpSharpBulkIcon;
