import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft2CurvedBrokenIcon component
 */
export const ArrowLeft2CurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M15.5 19.0002C15.5 19.0002 8.5 14.8562 8.5 12.0002C8.5 11.1722 9.088 10.2362 9.924 9.32422" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.7114 6.881C14.1944 5.773 15.5004 5 15.5004 5" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowLeft2CurvedBrokenIcon;
