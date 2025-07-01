import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PasswordSharpTwoToneIcon component
 */
export const PasswordSharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M10.9419 12H17.2599V13.852" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.4316 13.852V12" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M10.9394 12.0004C10.9394 13.0234 10.1104 13.8524 9.08735 13.8524C8.06435 13.8524 7.23535 13.0234 7.23535 12.0004C7.23535 10.9774 8.06435 10.1484 9.08735 10.1484H9.09035C10.1114 10.1494 10.9394 10.9784 10.9394 12.0004Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M21.5 21.25L21.5 2.75L3 2.75L3 21.25L21.5 21.25Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PasswordSharpTwoToneIcon;
