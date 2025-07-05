import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown3SharpBulkIcon component
 */
export const ArrowDown3SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M11.25 21L11.25 3.00024L13.25 3.00024L13.25 21L11.25 21Z"
      fill={color}
    />
    <Path
      d="M13.25 19.9999C13.25 16.329 10.0306 13.3398 6.58995 13.3398H5.58995V15.3398H6.58995C8.96881 15.3398 11.25 17.4759 11.25 19.9999V20.9999H13.25V19.9999Z"
      fill={color}
    />
    <Path
      d="M11.25 20.0004C11.25 16.3295 14.4694 13.3403 17.91 13.3403H18.91V15.3403H17.91C15.5312 15.3403 13.25 17.4764 13.25 20.0004V21.0004H11.25V20.0004Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDown3SharpBulkIcon;
