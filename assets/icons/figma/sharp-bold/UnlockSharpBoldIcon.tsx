import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UnlockSharpBoldIcon component
 */
export const UnlockSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M11.3596 17.9036H12.8596V14.1826H11.3596V17.9036ZM8.43965 9.60657V8.01357C8.44365 6.99857 8.84265 6.04657 9.56465 5.33057C10.2826 4.61957 11.2316 4.22957 12.2426 4.22957C13.3176 4.19557 14.3016 4.65157 15.0336 5.43057L15.5456 5.97757L16.6406 4.95157L16.1266 4.40457C15.1286 3.33957 13.7186 2.72957 12.2626 2.72957C10.8536 2.70057 9.51465 3.26857 8.50865 4.26557C7.50265 5.26257 6.94565 6.59157 6.93965 8.03057V9.60657H4.13965V22.4796H20.3596V9.60657H8.43965Z"
      fill={color}
    />
  </Svg>
);

export default UnlockSharpBoldIcon;
