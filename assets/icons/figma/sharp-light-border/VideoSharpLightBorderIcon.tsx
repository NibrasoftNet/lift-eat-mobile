import * as React from 'react';
import Svg, { SvgProps, Path, Rect } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VideoSharpLightBorderIcon component
 */
export const VideoSharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M17.256 9.9159L22.25 6.52979V18.5397L17.256 14.9209" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M9.4082 9.62109H12.6129" fill={none} stroke={color} strokeWidth="1.5" />
    <Rect x="2.25" y="5.65918" width="14.4845" height="13.7503" fill={none} stroke={color} />
  </Svg>
);

export default VideoSharpLightBorderIcon;
