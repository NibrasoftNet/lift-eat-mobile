import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSharpBrokenIcon component
 */
export const ArrowUpSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2495 17.3325V19.4995"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2495 5.09961V13.5026"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.27 10.55L12.25 4.5L6.22998 10.55"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowUpSharpBrokenIcon;
