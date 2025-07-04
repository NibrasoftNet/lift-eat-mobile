import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MessageCurvedLightBorderIcon component
 */
export const MessageCurvedLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M17.5449 9.01855C17.5449 9.01855 14.3349 12.8712 11.987 12.8712C9.64016 12.8712 6.39404 9.01855 6.39404 9.01855" fill="none" stroke={color} strokeWidth="1.5" />
    <Path d="M2.45215 11.9684C2.45215 5.13026 4.8331 2.85156 11.976 2.85156C19.1188 2.85156 21.4998 5.13026 21.4998 11.9684C21.4998 18.8054 19.1188 21.0851 11.976 21.0851C4.8331 21.0851 2.45215 18.8054 2.45215 11.9684Z" fill="none" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default MessageCurvedLightBorderIcon;
