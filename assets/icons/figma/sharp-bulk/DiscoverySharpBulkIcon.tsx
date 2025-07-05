import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DiscoverySharpBulkIcon component
 */
export const DiscoverySharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 2.25C6.874 2.25 2.5 6.624 2.5 12C2.5 17.376 6.874 21.75 12.25 21.75C17.626 21.75 22 17.376 22 12C22 6.624 17.626 2.25 12.25 2.25Z"
      fill={color}
    />
    <Path
      d="M8.93848 15.312L14.3745 14.123L15.5625 8.68701L10.1285 9.87701L8.93848 15.312Z"
      fill={color}
    />
  </Svg>
);

export default DiscoverySharpBulkIcon;
