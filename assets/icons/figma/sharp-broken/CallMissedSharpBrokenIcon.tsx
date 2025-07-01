import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallMissedSharpBrokenIcon component
 */
export const CallMissedSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M20.9653 5.17822L16.1123 10.0302" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.1123 5.17822L20.9653 10.0302" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M10.2808 14.273C12.0738 16.065 14.0738 16.613 14.0738 16.613L16.9278 14.97L21.5378 18.37C20.6808 19.903 19.5988 20.984 18.0668 21.842C8.91684 22.261 2.10384 11.887 3.05084 6.826C3.91884 5.333 5.03284 4.228 6.52284 3.354L9.76284 7.805L8.11984 10.659" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default CallMissedSharpBrokenIcon;
