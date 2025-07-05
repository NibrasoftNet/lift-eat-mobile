import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LockSharpBoldIcon component
 */
export const LockSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M16.0596 9.60657H8.43965V8.01357C8.44365 6.99957 8.84265 6.04657 9.56465 5.33157C10.2826 4.62057 11.2316 4.22957 12.2436 4.22957H12.2596C14.3556 4.22957 16.0596 5.93457 16.0596 8.03057V9.60657ZM11.3596 17.9036H12.8596V14.1826H11.3596V17.9036ZM17.5596 9.60657V8.03057C17.5596 5.10757 15.1816 2.72957 12.2626 2.72957C10.8596 2.70057 9.51465 3.26957 8.50965 4.26557C7.50265 5.26257 6.94565 6.59157 6.93965 8.03057V9.60657H4.13965V22.4796H20.3596V9.60657H17.5596Z"
      fill={color}
    />
  </Svg>
);

export default LockSharpBoldIcon;
