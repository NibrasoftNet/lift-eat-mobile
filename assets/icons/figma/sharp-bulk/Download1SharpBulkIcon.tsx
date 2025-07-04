import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Download1SharpBulkIcon component
 */
export const Download1SharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M2.5 8.92773V21.3748H22V8.92773H2.5Z" fill={color} />
    <Path d="M12.9941 14.8603L15.5221 12.3243L16.5851 13.3833L12.2431 17.7373L7.91406 13.3813L8.97706 12.3243L11.4941 14.8563V2.44486H12.9941V14.8603Z" fill={color} />
  </Svg>
);

export default Download1SharpBulkIcon;
