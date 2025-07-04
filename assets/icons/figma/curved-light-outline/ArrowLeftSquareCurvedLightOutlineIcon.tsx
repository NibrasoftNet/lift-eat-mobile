import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSquareCurvedLightOutlineIcon component
 */
export const ArrowLeftSquareCurvedLightOutlineIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11.6687 16.5021C11.5247 16.5021 11.3797 16.4611 11.2507 16.3741C10.0217 15.5471 7.15967 13.4651 7.15967 12.0001C7.15967 10.5351 10.0217 8.45507 11.2517 7.62907C11.5957 7.39807 12.0617 7.49007 12.2917 7.83407C12.5227 8.17807 12.4317 8.64407 12.0877 8.87507C10.9125 9.66499 9.80665 10.5824 9.18219 11.25H16.0802C16.4942 11.25 16.8302 11.586 16.8302 12C16.8302 12.414 16.4942 12.75 16.0802 12.75H9.17412C9.79716 13.4121 10.9077 14.3354 12.0887 15.1301C12.4327 15.3611 12.5227 15.8271 12.2917 16.1711C12.1477 16.3861 11.9097 16.5021 11.6687 16.5021Z" fill={color} />
    <Path d="M2 12C2 19.383 4.617 22 12 22C19.383 22 22 19.383 22 12C22 4.617 19.383 2 12 2C4.617 2 2 4.617 2 12ZM3.5 12C3.5 5.486 5.486 3.5 12 3.5C18.514 3.5 20.5 5.486 20.5 12C20.5 18.514 18.514 20.5 12 20.5C5.486 20.5 3.5 18.514 3.5 12Z" fill={color} />
  </Svg>
);

export default ArrowLeftSquareCurvedLightOutlineIcon;
