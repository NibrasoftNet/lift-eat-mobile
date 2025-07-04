import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight3CurvedTwoToneIcon component
 */
export const ArrowRight3CurvedTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M20.3539 12.1002C20.3539 10.8442 13.9899 6.82919 13.2679 7.55119C12.5459 8.27319 12.4769 15.8582 13.2679 16.6492C14.0599 17.4402 20.3539 13.3552 20.3539 12.1002Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.7 12.1064H3.75" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowRight3CurvedTwoToneIcon;
