import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CalendarSharpBulkIcon component
 */
export const CalendarSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M3.4248 22.4098H21.0748V11.0098H3.4248V22.4098Z" fill={color} />
    <Path d="M16.9848 2.65967V4.37967H21.0748V9.50967H3.4248V4.37967H7.0148V7.20967H8.0148V2.65967H9.5148V4.37967H14.4848V7.20967H15.4848V2.65967H16.9848Z" fill={color} />
    <Path d="M8.89477 13.1299V14.6299H7.39477L7.38477 13.1299H8.89477Z" fill={color} />
    <Path d="M8.89477 16.7199V18.2199H7.39477L7.38477 16.7199H8.89477Z" fill={color} />
    <Path d="M13.0048 18.2199V16.7199H11.4948L11.5048 18.2199H13.0048Z" fill={color} />
    <Path d="M13.0048 13.1299V14.6299H11.5048L11.4948 13.1299H13.0048Z" fill={color} />
    <Path d="M17.1148 18.2199V16.7199H15.6048L15.6148 18.2199H17.1148Z" fill={color} />
    <Path d="M17.1148 13.1299V14.6299H15.6148L15.6048 13.1299H17.1148Z" fill={color} />
  </Svg>
);

export default CalendarSharpBulkIcon;
