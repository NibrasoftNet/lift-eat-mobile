import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VideoSharpBoldIcon component
 */
export const VideoSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M7.78842 10.3697H12.4884V8.86967H7.78842V10.3697ZM0.878418 19.9097H16.3584V5.15967H0.878418V19.9097Z" fill={color} />
    <Path d="M17.6274 9.65056V15.1756L23.6214 19.5196V5.58656L17.6274 9.65056Z" fill={color} />
  </Svg>
);

export default VideoSharpBoldIcon;
