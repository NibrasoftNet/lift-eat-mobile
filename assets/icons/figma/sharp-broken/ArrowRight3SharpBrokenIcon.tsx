import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight3SharpBrokenIcon component
 */
export const ArrowRight3SharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path d="M20.25 12H10.291" fill='none' stroke={color} strokeWidth="1.5" />
    <Path
      d="M14.5898 17.66C14.5898 14.75 17.1518 12 20.2498 12"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M6.782 12H4.25" fill='none' stroke={color} strokeWidth="1.5" />
    <Path
      d="M14.5898 6.34033C14.5898 9.25033 17.1518 12.0003 20.2498 12.0003"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowRight3SharpBrokenIcon;
