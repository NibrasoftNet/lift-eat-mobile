import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight2SharpTwoToneIcon component
 */
export const ArrowRight2SharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path d="M8.75 19L15.75 12" fill='none' stroke={color} strokeWidth="1.5" />
    <Path d="M15.75 12L8.75 5" fill='none' stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowRight2SharpTwoToneIcon;
