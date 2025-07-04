import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSquareSharpBulkIcon component
 */
export const ArrowRightSquareSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M22 21.75L22 2.25L2.5 2.25L2.5 21.75L22 21.75Z" fill={color} />
    <Path d="M12.5701 16.811L17.3991 12L12.5701 7.18904L11.5121 8.25203L14.5211 11.25L7.41406 11.25L7.41406 12.75L14.5211 12.75L11.5121 15.748L12.5701 16.811Z" fill={color} />
  </Svg>
);

export default ArrowRightSquareSharpBulkIcon;
