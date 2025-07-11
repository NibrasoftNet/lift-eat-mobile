import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LoginSharpBrokenIcon component
 */
export const LoginSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M20.7327 10.2354V21.4604H9.30371V16.8354"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.7071 12.2109H3.76709"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.1108 16.8059C13.1108 14.4439 15.1908 12.2109 17.7058 12.2109"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.1108 7.61475C13.1108 9.97775 15.1908 12.2107 17.7058 12.2107"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.30371 7.58594V2.96094H20.7327V6.24994"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default LoginSharpBrokenIcon;
