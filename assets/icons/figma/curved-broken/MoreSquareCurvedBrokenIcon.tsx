import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreSquareCurvedBrokenIcon component
 */
export const MoreSquareCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 21.25C5.063 21.25 2.75 18.937 2.75 12C2.75 5.063 5.063 2.75 12 2.75C18.937 2.75 21.25 5.063 21.25 12C21.25 17.506 19.793 20.099 15.724 20.934"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M15.994 12H16.003" fill='none' stroke={color} strokeWidth="2" />
    <Path d="M11.995 12H12.004" fill='none' stroke={color} strokeWidth="2" />
    <Path d="M7.99501 12H8.00401" fill='none' stroke={color} strokeWidth="2" />
  </Svg>
);

export default MoreSquareCurvedBrokenIcon;
