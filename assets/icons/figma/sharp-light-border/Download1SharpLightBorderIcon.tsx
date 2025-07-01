import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Download1SharpLightBorderIcon component
 */
export const Download1SharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M12.2497 15.935V3.15723" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.9751 13.395L12.2501 16.6846L15.5261 13.395" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.875 9.41406H21.5V20.8429H3V9.41406H7.625" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Download1SharpLightBorderIcon;
