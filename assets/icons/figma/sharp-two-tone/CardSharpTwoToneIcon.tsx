import * as React from 'react';
import Svg, { SvgProps, Path, Rect } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CardSharpTwoToneIcon component
 */
export const CardSharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M15.1016 15.481H18.5768" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M10.876 15.481H11.6238" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M3 9.92188H21.5" fill={none} stroke={color} strokeWidth="1.5" />
    <Rect x="3" y="5.10889" width="18.5" height="14.06" fill={none} stroke={color} />
  </Svg>
);

export default CardSharpTwoToneIcon;
