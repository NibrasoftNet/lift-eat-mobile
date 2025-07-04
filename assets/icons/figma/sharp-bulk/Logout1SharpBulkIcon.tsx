import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Logout1SharpBulkIcon component
 */
export const Logout1SharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M2.30664 21.75L13.7679 21.75L13.7679 2.25L2.30664 2.25L2.30664 21.75Z" fill={color} />
    <Path d="M19.9599 11.2559L17.4239 8.72794L18.4829 7.66494L22.8369 12.0069L18.4809 16.3359L17.4239 15.2729L19.9559 12.7559L7.54447 12.7559L7.54447 11.2559L19.9599 11.2559Z" fill={color} />
  </Svg>
);

export default Logout1SharpBulkIcon;
