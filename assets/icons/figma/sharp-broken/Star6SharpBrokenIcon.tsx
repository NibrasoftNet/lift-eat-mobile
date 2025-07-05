import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star6SharpBrokenIcon component
 */
export const Star6SharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M17.1165 15.866L20.2605 16.625L15.7805 12L20.2605 7.375L14.0205 8.94L12.2505 2.75L10.4805 8.94"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.00023 8.318L4.24023 7.375L8.72023 12L4.24023 16.625L10.4802 15.06L12.2502 21.25L14.0202 15.06"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Star6SharpBrokenIcon;
