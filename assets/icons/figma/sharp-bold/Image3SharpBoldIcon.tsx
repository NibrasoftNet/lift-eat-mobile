import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Image3SharpBoldIcon component
 */
export const Image3SharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M20.287 20.803H4.368L4.171 20.4L7.841 15.656L8.198 15.616L10.689 17.7L14.514 12.33L14.924 12.333L20.493 20.411L20.287 20.803ZM8.896 6.874C10.167 6.875 11.202 7.909 11.203 9.179C11.203 10.451 10.168 11.485 8.896 11.485C7.626 11.485 6.592 10.451 6.592 9.179C6.592 7.908 7.626 6.874 8.896 6.874ZM2.5 22.354H22V2.854H2.5V22.354Z" fill={color} />
  </Svg>
);

export default Image3SharpBoldIcon;
