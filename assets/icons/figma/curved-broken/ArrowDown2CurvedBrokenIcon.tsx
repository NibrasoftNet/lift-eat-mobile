import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown2CurvedBrokenIcon component
 */
export const ArrowDown2CurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M18.9997 8.5C18.9997 8.5 14.8557 15.5 11.9997 15.5C11.1717 15.5 10.2357 14.912 9.32373 14.076"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.881 11.289C5.773 9.806 5 8.5 5 8.5"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowDown2CurvedBrokenIcon;
