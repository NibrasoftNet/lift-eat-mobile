import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LoginCurvedBrokenIcon component
 */
export const LoginCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M21.2391 15.7676C20.9931 19.8046 19.8191 21.2496 14.2041 21.2496C8.8741 21.2496 7.5341 19.9496 7.2041 16.3696"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.7361 12.1201H7.86914"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M4.84331 12.1201H2.69531"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.8091 9.2002L14.7371 12.1202L11.8091 15.0402"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.2041 7.63C7.5341 4.05 8.8741 2.75 14.2041 2.75C21.3041 2.75 21.3041 5.06 21.3041 12"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default LoginCurvedBrokenIcon;
