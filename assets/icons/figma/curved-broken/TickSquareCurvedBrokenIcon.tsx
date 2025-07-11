import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TickSquareCurvedBrokenIcon component
 */
export const TickSquareCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M8.43945 12L10.8095 14.373L15.5595 9.62695"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.597 20.96C19.764 20.152 21.25 17.563 21.25 12C21.25 5.063 18.94 2.75 12 2.75C5.06 2.75 2.75 5.063 2.75 12C2.75 18.937 5.06 21.25 12 21.25"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default TickSquareCurvedBrokenIcon;
