import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownCurvedTwoToneIcon component
 */
export const ArrowDownCurvedTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12.2744 19.75V4.75" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M18.299 13.6992C18.299 13.6992 15.038 19.7492 12.276 19.7492C9.512 19.7492 6.25 13.6992 6.25 13.6992" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowDownCurvedTwoToneIcon;
