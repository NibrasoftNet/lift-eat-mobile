import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Download1SharpBoldIcon component
 */
export const Download1SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M11.5 8.92871H13V2.42871H11.5V8.92871Z" fill={color} />
    <Path d="M13 8.92871V14.8887L15.53 12.3487L16.59 13.4087L12.25 17.7687L7.92 13.4087L8.98 12.3487L11.5 14.8887V8.92871H2.5V21.3587H22V8.92871H13Z" fill={color} />
  </Svg>
);

export default Download1SharpBoldIcon;
