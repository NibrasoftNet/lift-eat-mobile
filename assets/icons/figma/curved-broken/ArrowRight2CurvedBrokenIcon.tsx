import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight2CurvedBrokenIcon component
 */
export const ArrowRight2CurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.289 17.1191C9.806 18.2271 8.5 19.0001 8.5 19.0001"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.5 5C8.5 5 15.5 9.144 15.5 12C15.5 12.828 14.912 13.764 14.076 14.676"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowRight2CurvedBrokenIcon;
