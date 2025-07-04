import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FilterCurvedLightBorderIcon component
 */
export const FilterCurvedLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M10.4842 17.2452H4.01172" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.5454 17.2462C14.5454 19.288 15.2263 19.968 17.2672 19.968C19.3081 19.968 19.989 19.288 19.989 17.2462C19.989 15.2044 19.3081 14.5244 17.2672 14.5244C15.2263 14.5244 14.5454 15.2044 14.5454 17.2462Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.5171 6.75596H19.9887" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M9.4557 6.75499C9.4557 4.7141 8.77481 4.0332 6.73391 4.0332C4.69213 4.0332 4.01123 4.7141 4.01123 6.75499C4.01123 8.79678 4.69213 9.47678 6.73391 9.47678C8.77481 9.47678 9.4557 8.79678 9.4557 6.75499Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default FilterCurvedLightBorderIcon;
