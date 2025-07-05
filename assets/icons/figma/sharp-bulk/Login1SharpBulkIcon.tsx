import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Login1SharpBulkIcon component
 */
export const Login1SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M9.26758 21.75L21.7147 21.75L21.7147 2.25L9.26758 2.25L9.26758 21.75Z"
      fill={color}
    />
    <Path
      d="M15.2001 11.2559L12.6641 8.72794L13.7231 7.66494L18.0771 12.0069L13.7211 16.3359L12.6641 15.2729L15.1961 12.7559L2.78471 12.7559L2.78471 11.2559L15.2001 11.2559Z"
      fill={color}
    />
  </Svg>
);

export default Login1SharpBulkIcon;
