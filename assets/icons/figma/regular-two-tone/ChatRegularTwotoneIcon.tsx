import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ChatRegularTwotoneIcon component
 */
export const ChatRegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M19.0714 19.0699C16.0152 22.1263 11.4898 22.7867 7.78642 21.074C7.23971 20.8539 6.79148 20.676 6.36537 20.676C5.17849 20.683 3.70117 21.8339 2.93336 21.067C2.16555 20.2991 3.31726 18.8206 3.31726 17.6266C3.31726 17.2004 3.14642 16.7602 2.92632 16.2124C1.21283 12.5096 1.87411 7.98269 4.93026 4.92721C8.8316 1.02443 15.17 1.02443 19.0714 4.9262C22.9797 8.83501 22.9727 15.1681 19.0714 19.0699Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.9393 12.4131H15.9483" fill={none} stroke={color} strokeWidth="2" />
    <Path d="M11.9306 12.4131H11.9396" fill={none} stroke={color} strokeWidth="2" />
    <Path d="M7.92128 12.4131H7.93028" fill={none} stroke={color} strokeWidth="2" />
  </Svg>
);

export default ChatRegularTwotoneIcon;
