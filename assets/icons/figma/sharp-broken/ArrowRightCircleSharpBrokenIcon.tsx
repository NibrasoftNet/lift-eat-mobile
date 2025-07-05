import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightCircleSharpBrokenIcon component
 */
export const ArrowRightCircleSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M16.522 20.207C19.481 18.664 21.5 15.568 21.5 12C21.5 6.892 17.36 2.75 12.25 2.75C7.14 2.75 3 6.892 3 12C3 17.109 7.14 21.25 12.25 21.25"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.8105 15.4713L14.2905 12.0003L10.8105 8.5293"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowRightCircleSharpBrokenIcon;
