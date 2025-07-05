import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SendSharpBoldIcon component
 */
export const SendSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M21.6515 2.15186L2.7955 7.75786L2.4375 7.89386V8.53386L9.8175 13.4659L15.4675 7.81586L16.5285 8.87686L10.8665 14.5379L15.6035 21.6259L15.7765 21.8479H16.4185L22.0125 2.89386L22.0625 2.58186L21.6515 2.15186Z"
      fill={color}
    />
  </Svg>
);

export default SendSharpBoldIcon;
