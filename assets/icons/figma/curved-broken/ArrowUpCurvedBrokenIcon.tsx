import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCurvedBrokenIcon component
 */
export const ArrowUpCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.9946 16.7266V19.4996"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.9946 4.5V13.123"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.0251 10.55C18.0251 10.55 14.7651 4.5 12.0051 4.5C9.2351 4.5 5.9751 10.55 5.9751 10.55"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowUpCurvedBrokenIcon;
