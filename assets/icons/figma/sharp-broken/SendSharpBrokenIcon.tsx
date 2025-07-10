import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SendSharpBrokenIcon component
 */
export const SendSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M18.0271 14.6461L16.0591 21.3151H16.0341L10.7931 13.4731L2.95215 8.23306V8.20406L21.5161 2.68506L21.5481 2.71806L19.1841 10.7271"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.04 13.2853L15.482 8.84326"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default SendSharpBrokenIcon;
