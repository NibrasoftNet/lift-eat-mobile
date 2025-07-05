import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star4SharpBulkIcon component
 */
export const Star4SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2501 1.3125C10.2991 6.57057 6.75866 10.077 1.55811 12.0005C6.81939 13.9424 10.3209 17.4923 12.2501 22.6875V1.3125Z"
      fill={color}
    />
    <Path
      d="M12.2499 1.3125C14.2009 6.57057 17.7413 10.077 22.9419 12.0005C17.6806 13.9424 14.1791 17.4923 12.2499 22.6875V1.3125Z"
      fill={color}
    />
  </Svg>
);

export default Star4SharpBulkIcon;
