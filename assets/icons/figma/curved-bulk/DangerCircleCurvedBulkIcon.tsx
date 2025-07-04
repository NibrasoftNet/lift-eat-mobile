import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DangerCircleCurvedBulkIcon component
 */
export const DangerCircleCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M12.25 2.78516C5.052 2.78516 2.5 5.33716 2.5 12.5352C2.5 19.7332 5.052 22.2852 12.25 22.2852C19.448 22.2852 22 19.7332 22 12.5352C22 5.33716 19.448 2.78516 12.25 2.78516Z" fill={color} />
    <Path d="M11.499 16.0356C11.499 16.4496 11.84 16.7856 12.254 16.7856C12.668 16.7856 13.004 16.4496 13.004 16.0356C13.004 15.6216 12.668 15.2856 12.254 15.2856H12.245C11.831 15.2856 11.499 15.6216 11.499 16.0356Z" fill={color} />
    <Path d="M12.25 7.89062C11.836 7.89062 11.5 8.22662 11.5 8.64062V12.5356C11.5 12.9496 11.836 13.2856 12.25 13.2856C12.664 13.2856 13 12.9496 13 12.5356V8.64062C13 8.22662 12.664 7.89062 12.25 7.89062Z" fill={color} />
  </Svg>
);

export default DangerCircleCurvedBulkIcon;
