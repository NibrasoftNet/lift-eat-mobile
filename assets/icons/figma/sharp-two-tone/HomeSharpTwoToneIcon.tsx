import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HomeSharpTwoToneIcon component
 */
export const HomeSharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M2.18359 11.3755L12.2498 2.75L22.3159 11.3755" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M4.34277 10.1592V21.2501H20.1603V10.1592" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.25 12.7051L12.25 16.1135" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default HomeSharpTwoToneIcon;
