import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FilterSharpLightBorderIcon component
 */
export const FilterSharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M15.0049 17.4707H5.36285" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.9896 17.4102C14.9896 15.9681 16.1674 14.7988 17.6198 14.7988C19.0723 14.7988 20.25 15.9681 20.25 17.4102C20.25 18.8523 19.0723 20.0216 17.6198 20.0216C16.1674 20.0216 14.9896 18.8523 14.9896 17.4102Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M9.49512 7.85791H19.1372" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M9.51039 7.79792C9.51039 6.35584 8.33265 5.18652 6.88019 5.18652C5.42774 5.18652 4.25 6.35584 4.25 7.79792C4.25 9.23999 5.42774 10.4093 6.88019 10.4093C8.33265 10.4093 9.51039 9.23999 9.51039 7.79792Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default FilterSharpLightBorderIcon;
