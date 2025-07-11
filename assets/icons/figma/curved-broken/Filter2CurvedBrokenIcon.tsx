import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Filter2CurvedBrokenIcon component
 */
export const Filter2CurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.445 3.06104C19.56 3.22704 21 3.83904 21 6.10104C21 9.82704 14.017 12.205 14.017 15.6C14.017 18.994 14.014 21 12.004 21C9.992 21 9.984 18.994 9.984 15.6C9.984 12.205 3 9.82704 3 6.10104C3 2.95304 5.79 3.00004 11.999 3.00004"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Filter2CurvedBrokenIcon;
