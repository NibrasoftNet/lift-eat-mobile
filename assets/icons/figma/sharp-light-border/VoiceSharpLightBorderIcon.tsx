import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VoiceSharpLightBorderIcon component
 */
export const VoiceSharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M9.52949 22.104H14.9697" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.25 22.1037V17.7139" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M3.74512 12.6037V8.21387" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M20.7549 12.6037V8.21387" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.2504 17.7139C9.88378 17.7139 7.96484 15.7872 7.96484 13.4096V7.40945C7.96484 5.03185 9.88378 3.104 12.2504 3.104C14.6181 3.104 16.5359 5.03185 16.5359 7.40945V13.4096C16.5359 15.7872 14.6181 17.7139 12.2504 17.7139Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default VoiceSharpLightBorderIcon;
