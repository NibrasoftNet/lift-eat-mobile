import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlaySharpBoldIcon component
 */
export const PlaySharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M10.253 15.983V9.215L15.582 12.599L10.253 15.983ZM12.25 2.854C6.874 2.854 2.5 7.228 2.5 12.604C2.5 17.98 6.874 22.354 12.25 22.354C17.626 22.354 22 17.98 22 12.604C22 7.228 17.626 2.854 12.25 2.854Z" fill={color} />
  </Svg>
);

export default PlaySharpBoldIcon;
