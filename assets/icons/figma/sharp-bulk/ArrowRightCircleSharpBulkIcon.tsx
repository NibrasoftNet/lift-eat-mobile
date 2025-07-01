import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightCircleSharpBulkIcon component
 */
export const ArrowRightCircleSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M2.5 12C2.5 17.376 6.874 21.75 12.25 21.75C17.626 21.75 22 17.376 22 12C22 6.624 17.626 2.25 12.25 2.25C6.874 2.25 2.5 6.624 2.5 12Z" fill={color} />
    <Path d="M10.8051 16.5298L15.3561 11.9998L10.8051 7.46978L9.74707 8.53278L13.2301 11.9998L9.74707 15.4668L10.8051 16.5298Z" fill={color} />
  </Svg>
);

export default ArrowRightCircleSharpBulkIcon;
