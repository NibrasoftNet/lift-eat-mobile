import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Delete2SharpBrokenIcon component
 */
export const Delete2SharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M18.7131 21.3884H5.78714L4.36914 6.58936H20.1301L19.1191 17.1504" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.251 11.5024V16.4744" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.7273 6.13567L15.6583 2.88867H8.84326" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Delete2SharpBrokenIcon;
