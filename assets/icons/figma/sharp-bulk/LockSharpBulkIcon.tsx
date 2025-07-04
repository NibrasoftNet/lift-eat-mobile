import * as React from 'react';
import Svg, { SvgProps, Path, Rect } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LockSharpBulkIcon component
 */
export const LockSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M8.43994 8.01357V9.56689H6.93994V8.03057C6.94594 6.59157 7.50294 5.26257 8.50994 4.26557C9.51494 3.26957 10.8599 2.70057 12.2629 2.72957C15.1819 2.72957 17.5599 5.10757 17.5599 8.03057V9.56689H16.0599V8.03057C16.0599 5.93457 14.3559 4.22957 12.2599 4.22957H12.2439C11.2319 4.22957 10.2829 4.62057 9.56494 5.33157C8.84294 6.04657 8.44394 6.99957 8.43994 8.01357Z" fill={color} />
    <Path d="M11.3599 17.9036H12.8599V14.1826H11.3599V17.9036Z" fill={color} />
    <Rect x="4.14014" y="0.4" width="16.22" height="12.9126" fill={color} />
  </Svg>
);

export default LockSharpBulkIcon;
