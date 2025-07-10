import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreSquareSharpBrokenIcon component
 */
export const MoreSquareSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M16.1903 12.5474H16.1993"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.1801 12.5474H12.1891"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.17128 12.5474H8.18028"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.03 21.7847H21.5V3.28467H3V21.7847H8.46"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default MoreSquareSharpBrokenIcon;
