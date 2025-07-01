import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FilterSharpBulkIcon component
 */
export const FilterSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M6.88 10.9085C8.606 10.9085 10.01 9.51252 10.01 7.79752C10.01 6.08152 8.606 4.68652 6.88 4.68652C5.154 4.68652 3.75 6.08152 3.75 7.79752C3.75 9.51252 5.154 10.9085 6.88 10.9085Z" fill={color} />
    <Path d="M17.6202 14.2981C15.8942 14.2981 14.4902 15.6941 14.4902 17.4091C14.4902 19.1251 15.8942 20.5211 17.6202 20.5211C19.3462 20.5211 20.7502 19.1251 20.7502 17.4091C20.7502 15.6941 19.3462 14.2981 17.6202 14.2981Z" fill={color} />
    <Path d="M11.7448 8.60742H19.8868V7.10742H11.7448V8.60742Z" fill={color} />
    <Path d="M4.61279 18.2204H12.7548V16.7204H4.61279V18.2204Z" fill={color} />
  </Svg>
);

export default FilterSharpBulkIcon;
