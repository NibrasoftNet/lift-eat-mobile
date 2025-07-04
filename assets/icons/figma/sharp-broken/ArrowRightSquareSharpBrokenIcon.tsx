import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSquareSharpBrokenIcon component
 */
export const ArrowRightSquareSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M18.073 21.25H21.5V2.75H3V21.25H12.847" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.5892 12H8.15918" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.5693 8.25195L16.3393 12L12.5693 15.748" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowRightSquareSharpBrokenIcon;
