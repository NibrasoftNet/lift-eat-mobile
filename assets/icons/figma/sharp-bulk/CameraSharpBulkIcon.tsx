import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CameraSharpBulkIcon component
 */
export const CameraSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M17.295 6.19819L15.563 3.49219H8.935L7.204 6.19819H2.5V20.5082H22V6.19819H17.295Z" fill={color} />
    <Path d="M17.8583 10.2393H19.3583V8.73926H17.8493L17.8583 10.2393Z" fill={color} />
    <Path d="M8.81934 13.2143C8.81934 15.1053 10.3583 16.6433 12.2493 16.6433C14.1393 16.6433 15.6773 15.1053 15.6773 13.2143C15.6773 11.3233 14.1393 9.78526 12.2493 9.78526C10.3583 9.78526 8.81934 11.3233 8.81934 13.2143Z" fill={color} />
  </Svg>
);

export default CameraSharpBulkIcon;
