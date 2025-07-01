import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * AvatarSharpBrokenIcon component
 */
export const AvatarSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M12.25 21.3887C7.141 21.3887 3 17.2477 3 12.1387C3 7.02967 7.141 2.88867 12.25 2.88867C17.359 2.88867 21.5 7.02967 21.5 12.1387C21.5 15.7087 19.477 18.8067 16.515 20.3487" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.6366 11.3125H16.6466" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.18348 11.3125H7.19348" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.6865 8.41553L9.77148 14.9085L9.95248 15.2105H13.5445" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default AvatarSharpBrokenIcon;
