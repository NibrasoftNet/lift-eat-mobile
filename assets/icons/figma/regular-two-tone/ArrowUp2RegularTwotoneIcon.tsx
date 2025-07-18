import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp2RegularTwotoneIcon component
 */
export const ArrowUp2RegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M5 15.5L12 8.5L19 15.5"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowUp2RegularTwotoneIcon;
