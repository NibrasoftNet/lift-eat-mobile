import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DiscoveryCurvedBulkIcon component
 */
export const DiscoveryCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 2.25C5.051 2.25 2.5 4.802 2.5 12C2.5 19.198 5.051 21.75 12.25 21.75C19.449 21.75 22 19.198 22 12C22 4.802 19.449 2.25 12.25 2.25Z"
      fill={color}
    />
    <Path
      d="M14.4513 13.7553L15.8683 9.22734C15.9433 8.98834 15.8793 8.72634 15.7013 8.54834C15.5243 8.37034 15.2623 8.30434 15.0223 8.38134L10.4923 9.79834C10.2813 9.86434 10.1153 10.0293 10.0493 10.2413L8.63128 14.7713C8.55628 15.0113 8.62128 15.2733 8.79828 15.4503C8.92728 15.5793 9.10028 15.6483 9.27628 15.6483C9.34428 15.6483 9.41128 15.6383 9.47828 15.6173L14.0083 14.1993C14.2193 14.1333 14.3853 13.9673 14.4513 13.7553Z"
      fill={color}
    />
  </Svg>
);

export default DiscoveryCurvedBulkIcon;
