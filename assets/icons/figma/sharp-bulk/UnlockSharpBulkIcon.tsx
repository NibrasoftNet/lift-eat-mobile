import * as React from 'react';
import Svg, { SvgProps, Path, Rect } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UnlockSharpBulkIcon component
 */
export const UnlockSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M11.3595 17.9036H12.8595V14.1826H11.3595V17.9036ZM8.43945 9.60657V8.01357C8.44345 6.99857 8.84245 6.04657 9.56445 5.33057C10.2825 4.61957 11.2315 4.22957 12.2425 4.22957C13.3175 4.19557 14.3015 4.65157 15.0335 5.43057L15.5455 5.97757L16.6405 4.95157L16.1265 4.40457C15.1285 3.33957 13.7185 2.72957 12.2625 2.72957C10.8535 2.70057 9.51445 3.26857 8.50845 4.26557C7.50245 5.26257 6.94545 6.59157 6.93945 8.03057V9.60657H8.43945Z" fill={color} />
    <Rect x="4.13965" y="0.4" width="16.22" height="12.9126" fill={color} />
  </Svg>
);

export default UnlockSharpBulkIcon;
