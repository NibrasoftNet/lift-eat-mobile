import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSquareCurvedBrokenIcon component
 */
export const ArrowUpSquareCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.9995 7.91406V16.0861"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.24951 11.6781C8.24951 11.6781 10.7795 7.91406 11.9995 7.91406C13.2195 7.91406 15.7495 11.6781 15.7495 11.6781"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.295 21.014C19.693 20.273 21.25 17.695 21.25 12C21.25 5.063 18.94 2.75 12 2.75C5.06 2.75 2.75 5.063 2.75 12C2.75 18.937 5.06 21.25 12 21.25"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowUpSquareCurvedBrokenIcon;
