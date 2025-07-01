import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DocumentSharpBrokenIcon component
 */
export const DocumentSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M10.9376 13.3931H8.62158" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.6916 9.229H8.62158" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.846 21.25H3.87695V2.75H20.623V21.25" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default DocumentSharpBrokenIcon;
