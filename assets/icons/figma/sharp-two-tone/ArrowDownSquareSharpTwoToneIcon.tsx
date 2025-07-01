import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownSquareSharpTwoToneIcon component
 */
export const ArrowDownSquareSharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M3 21.25H21.5V2.75H3V21.25Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.25 15.3383V7.91406" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.998 12.3223L12.25 16.0863L8.50195 12.3223" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowDownSquareSharpTwoToneIcon;
