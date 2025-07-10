import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GameSharpBrokenIcon component
 */
export const GameSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M17.0061 16.3594H16.9021"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.89258 12.7666V16.4146"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.7523 14.5908H7.03027"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.2405 12.8779H15.1365"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.1733 20.1436C21.8463 18.8816 22.9283 16.8766 22.9283 14.6186C22.9283 10.7996 19.8313 7.70264 16.0123 7.70264H8.48729C4.66829 7.70264 1.57129 10.7996 1.57129 14.6186C1.57129 18.4386 4.66829 21.5346 8.48729 21.5346H16.0123"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.82812 3.53467C7.82812 4.25567 8.42512 4.84067 9.16112 4.84067H10.1901C11.3251 4.84467 12.2451 5.74567 12.2501 6.85867V7.56567"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default GameSharpBrokenIcon;
