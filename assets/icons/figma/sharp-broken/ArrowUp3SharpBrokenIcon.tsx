import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp3SharpBrokenIcon component
 */
export const ArrowUp3SharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 17.4678V19.9998"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M12.25 4V13.959" fill='none' stroke={color} strokeWidth="1.5" />
    <Path
      d="M17.91 9.66C15 9.66 12.25 7.098 12.25 4"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.58984 9.66C9.49984 9.66 12.2498 7.098 12.2498 4"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowUp3SharpBrokenIcon;
