import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownSharpBrokenIcon component
 */
export const ArrowDownSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2495 18.8996V10.4966"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.27 13.4497L12.25 19.4997L6.22998 13.4497"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M12.2495 6.667V4.5" fill='none' stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowDownSharpBrokenIcon;
