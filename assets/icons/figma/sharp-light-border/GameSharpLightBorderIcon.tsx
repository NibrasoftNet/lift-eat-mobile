import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GameSharpLightBorderIcon component
 */
export const GameSharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M17.0057 16.3593H16.9014" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.89204 12.7666V16.4143" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M10.7522 14.5907H7.03027" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.2401 12.8779H15.1358" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.0118 21.5347C19.8314 21.5347 22.9277 18.4383 22.9277 14.6188V14.6188C22.9277 10.7992 19.8314 7.70287 16.0118 7.70287L8.48719 7.70287C4.66764 7.70287 1.57129 10.7992 1.57129 14.6188V14.6188C1.57129 18.4383 4.66764 21.5347 8.48718 21.5347L16.0118 21.5347Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.82812 3.53467C7.82812 4.25592 8.4247 4.84061 9.16061 4.84061H10.1897C11.325 4.84465 12.2446 5.74596 12.2498 6.85869V7.56593" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default GameSharpLightBorderIcon;
