import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightCurvedBrokenIcon component
 */
export const ArrowRightCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M19.5004 12.0049H10.8774"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M7.273 12.0049H4.5" fill={none} stroke={color} strokeWidth="1.5" />
    <Path
      d="M13.4502 5.97461C13.4502 5.97461 19.5002 9.23461 19.5002 11.9946C19.5002 14.7646 13.4502 18.0246 13.4502 18.0246"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowRightCurvedBrokenIcon;
