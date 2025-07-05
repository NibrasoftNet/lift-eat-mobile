import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownCircleSharpBrokenIcon component
 */
export const ArrowDownCircleSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M4.069 16.321C5.62 19.253 8.701 21.25 12.25 21.25C17.36 21.25 21.5 17.108 21.5 12C21.5 6.892 17.36 2.75 12.25 2.75C7.14 2.75 3 6.892 3 12"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.78027 10.5576L12.2503 14.0436L15.7203 10.5576"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowDownCircleSharpBrokenIcon;
