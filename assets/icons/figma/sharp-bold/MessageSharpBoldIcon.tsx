import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MessageSharpBoldIcon component
 */
export const MessageSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M12.29 15.0357L5.47 9.49467L6.415 8.32967L12.29 13.1027L18.163 8.32967L19.109 9.49367L12.29 15.0357ZM1.75 22.0347H22.75V3.03467H1.75V22.0347Z" fill={color} />
  </Svg>
);

export default MessageSharpBoldIcon;
