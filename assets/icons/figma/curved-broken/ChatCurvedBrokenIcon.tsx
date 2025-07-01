import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ChatCurvedBrokenIcon component
 */
export const ChatCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M15.9389 12.4131H15.9479" fill={none} stroke={color} strokeWidth="2" />
    <Path d="M11.9301 12.4131H11.9391" fill={none} stroke={color} strokeWidth="2" />
    <Path d="M7.92128 12.4131H7.93028" fill={none} stroke={color} strokeWidth="2" />
    <Path d="M19.071 4.92704C22.98 8.83604 22.972 15.168 19.071 19.07C16.016 22.126 11.49 22.787 7.78605 21.074C7.24005 20.854 3.70105 21.834 2.93305 21.067C2.16605 20.299 3.14605 16.76 2.92605 16.213C1.21305 12.51 1.87405 7.98304 4.93005 4.92704C7.85605 2.00004 12.153 1.26804 15.764 2.73204" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ChatCurvedBrokenIcon;
