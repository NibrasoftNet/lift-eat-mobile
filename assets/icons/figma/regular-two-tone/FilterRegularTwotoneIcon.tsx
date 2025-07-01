import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FilterRegularTwotoneIcon component
 */
export const FilterRegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11 17.5H4" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M20 17.5C20 18.8807 18.8807 20 17.5 20C16.1193 20 15 18.8807 15 17.5C15 16.1183 16.1193 15 17.5 15C18.8807 15 20 16.1183 20 17.5Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13 6.5H20" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M4 6.5C4 7.88174 5.11928 9 6.5 9C7.88072 9 9 7.88174 9 6.5C9 5.11928 7.88072 4 6.5 4C5.11928 4 4 5.11928 4 6.5Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default FilterRegularTwotoneIcon;
