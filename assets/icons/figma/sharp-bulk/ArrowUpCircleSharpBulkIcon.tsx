import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCircleSharpBulkIcon component
 */
export const ArrowUpCircleSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 21.75C6.874 21.75 2.5 17.376 2.5 12C2.5 6.624 6.874 2.25 12.25 2.25C17.626 2.25 22 6.624 22 12C22 17.376 17.626 21.75 12.25 21.75Z"
      fill={color}
    />
    <Path
      d="M7.72021 13.4449L12.2502 8.89393L16.7802 13.4449L15.7172 14.5029L12.2502 11.0199L8.78322 14.5029L7.72021 13.4449Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpCircleSharpBulkIcon;
