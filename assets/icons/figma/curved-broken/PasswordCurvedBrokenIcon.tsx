import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PasswordCurvedBrokenIcon component
 */
export const PasswordCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M10.6919 12H17.0099V13.852"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M14.1821 13.852V12" fill='none' stroke={color} strokeWidth="1.5" />
    <Path
      d="M8.83686 10.1484H8.83986C9.86186 10.1494 10.6889 10.9784 10.6889 12.0004C10.6889 13.0234 9.85986 13.8524 8.83686 13.8524C7.81386 13.8524 6.98486 13.0234 6.98486 12.0004"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12 21.25C5.063 21.25 2.75 18.937 2.75 12C2.75 5.063 5.063 2.75 12 2.75C18.937 2.75 21.25 5.063 21.25 12C21.25 17.753 19.659 20.325 15.16 21.036"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PasswordCurvedBrokenIcon;
