import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSharpBulkIcon component
 */
export const ArrowLeftSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M20.9585 13L4.55825 13L4.55825 11L20.9585 11L20.9585 13Z"
      fill={color}
    />
    <Path
      d="M12.4224 5.97866L6.37536 12.0007L12.4224 18.0217L11.0112 19.4389L3.54094 12.0008L11.0111 4.56152L12.4224 5.97866Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeftSharpBulkIcon;
