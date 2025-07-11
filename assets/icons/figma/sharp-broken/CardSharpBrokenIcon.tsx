import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CardSharpBrokenIcon component
 */
export const CardSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M17.801 5.1084H21.5V19.1684H3V5.1084H13.441"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.1021 15.4805H18.5771"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.8755 15.4805H11.6235"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.08496 9.92139H21.5"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CardSharpBrokenIcon;
