import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VoiceRegularLightBorderIcon component
 */
export const VoiceRegularLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11.9999 22V18.839" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.9996 14.8481V14.8481C9.75637 14.8481 7.9375 13.0218 7.9375 10.7682V6.08095C7.9375 3.82732 9.75637 2 11.9996 2C14.2438 2 16.0617 3.82732 16.0617 6.08095V10.7682C16.0617 13.0218 14.2438 14.8481 11.9996 14.8481Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M20 10.8007C20 15.2395 16.4188 18.8383 11.9995 18.8383C7.58117 18.8383 4 15.2395 4 10.8007" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default VoiceRegularLightBorderIcon;
