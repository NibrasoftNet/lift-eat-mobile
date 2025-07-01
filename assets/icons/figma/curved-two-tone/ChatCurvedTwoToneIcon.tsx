import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ChatCurvedTwoToneIcon component
 */
export const ChatCurvedTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M15.9393 12.4131H15.9483" fill={none} stroke={color} strokeWidth="2" />
    <Path d="M11.9306 12.4131H11.9396" fill={none} stroke={color} strokeWidth="2" />
    <Path d="M7.92128 12.4131H7.93028" fill={none} stroke={color} strokeWidth="2" />
    <Path d="M19.071 19.0698C16.0159 22.1264 11.4896 22.7867 7.78631 21.074C7.23961 20.8539 3.70113 21.8339 2.93334 21.067C2.16555 20.2991 3.14639 16.7601 2.92631 16.2134C1.21285 12.5106 1.87411 7.9826 4.9302 4.9271C8.83147 1.0243 15.1698 1.0243 19.071 4.9271C22.9803 8.83593 22.9723 15.1681 19.071 19.0698Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ChatCurvedTwoToneIcon;
