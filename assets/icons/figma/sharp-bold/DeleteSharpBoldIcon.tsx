import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DeleteSharpBoldIcon component
 */
export const DeleteSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M11.5001 18.1369H13.0001V11.9769H11.5001V18.1369ZM4.33008 7.63686L5.75008 22.4769H18.7501L20.1701 7.63686H4.33008Z" fill={color} />
    <Path d="M18.1881 4.16596H16.6071V2.73096H7.89307V4.16596H6.31207V5.66596H18.1881V4.16596Z" fill={color} />
  </Svg>
);

export default DeleteSharpBoldIcon;
