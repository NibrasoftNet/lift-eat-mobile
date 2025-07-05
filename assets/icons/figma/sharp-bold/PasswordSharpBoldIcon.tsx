import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PasswordSharpBoldIcon component
 */
export const PasswordSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M18.01 14.602H16.51V12.75H15.182V14.602H13.682V12.75H11.566C11.242 13.818 10.259 14.602 9.087 14.602C7.653 14.602 6.486 13.435 6.486 12C6.486 10.566 7.653 9.398 9.087 9.398C10.26 9.4 11.242 10.183 11.566 11.25H18.01V14.602ZM2.5 21.75H22V2.25H2.5V21.75Z"
      fill={color}
    />
    <Path
      d="M9.08911 10.8983C8.48011 10.8983 7.98511 11.3923 7.98511 12.0003C7.98511 12.6083 8.48011 13.1023 9.08711 13.1023C9.69511 13.1023 10.1901 12.6083 10.1901 12.0003C10.1901 11.3933 9.69611 10.8983 9.08911 10.8983Z"
      fill={color}
    />
  </Svg>
);

export default PasswordSharpBoldIcon;
