import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownCurvedBrokenIcon component
 */
export const ArrowDownCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.9946 19.5V10.877"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.0251 13.4502C18.0251 13.4502 14.7651 19.5002 12.0051 19.5002C9.2351 19.5002 5.9751 13.4502 5.9751 13.4502"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M11.9946 7.273V4.5" fill='none' stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowDownCurvedBrokenIcon;
