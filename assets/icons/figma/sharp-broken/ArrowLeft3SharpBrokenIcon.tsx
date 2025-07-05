import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft3SharpBrokenIcon component
 */
export const ArrowLeft3SharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M17.7183 12H20.2503"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M4.24951 12H14.2085"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.90951 17.66C9.90951 14.75 7.34751 12 4.24951 12"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.90951 6.33984C9.90951 9.24984 7.34751 11.9998 4.24951 11.9998"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowLeft3SharpBrokenIcon;
