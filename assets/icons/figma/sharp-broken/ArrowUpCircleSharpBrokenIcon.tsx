import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCircleSharpBrokenIcon component
 */
export const ArrowUpCircleSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M16.061 3.569C19.269 5.021 21.5 8.25 21.5 12C21.5 17.108 17.36 21.25 12.25 21.25C7.14 21.25 3 17.108 3 12C3 6.892 7.14 2.75 12.25 2.75"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.7793 13.443L12.2493 9.95703L15.7193 13.443"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowUpCircleSharpBrokenIcon;
