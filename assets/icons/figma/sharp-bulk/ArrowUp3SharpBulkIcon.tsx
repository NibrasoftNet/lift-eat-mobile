import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp3SharpBulkIcon component
 */
export const ArrowUp3SharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M11.25 3.00049L11.25 21.0002L13.25 21.0002L13.25 3.00049L11.25 3.00049Z" fill={color} />
    <Path d="M11.25 3.99962C11.25 7.67054 14.4694 10.6597 17.91 10.6597H18.91V8.65967H17.91C15.5312 8.65967 13.25 6.52365 13.25 3.99962V2.99962H11.25V3.99962Z" fill={color} />
    <Path d="M13.25 3.99962C13.25 7.67054 10.0306 10.6597 6.58995 10.6597H5.58995V8.65967H6.58995C8.96881 8.65967 11.25 6.52365 11.25 3.99962V2.99962H13.25V3.99962Z" fill={color} />
  </Svg>
);

export default ArrowUp3SharpBulkIcon;
