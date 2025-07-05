import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSquareCurvedBrokenIcon component
 */
export const ArrowRightSquareCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.0897 12H7.90967"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.3193 8.24805C12.3193 8.24805 16.0893 10.776 16.0893 12C16.0893 13.224 12.3193 15.748 12.3193 15.748"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.599 20.959C19.765 20.151 21.25 17.562 21.25 12C21.25 5.063 18.939 2.75 12 2.75C5.06 2.75 2.75 5.063 2.75 12C2.75 18.937 5.06 21.25 12 21.25"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowRightSquareCurvedBrokenIcon;
