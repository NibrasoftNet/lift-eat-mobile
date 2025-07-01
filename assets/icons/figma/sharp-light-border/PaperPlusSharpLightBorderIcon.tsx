import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperPlusSharpLightBorderIcon component
 */
export const PaperPlusSharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M14.3426 14.4112H9.40332" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.8729 16.8807L11.8729 11.9414" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.8179 2.75L4.5752 2.75V21.25H19.9245V8.06826L14.8179 2.75Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.3418 3.30469V8.65011H19.4489" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PaperPlusSharpLightBorderIcon;
