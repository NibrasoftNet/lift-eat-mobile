import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SwapSharpBoldIcon component
 */
export const SwapSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M21.4996 14.5545C20.1556 14.5545 18.8896 15.0885 17.8996 15.9435V5.20952H15.8996V15.9405C14.9126 15.0865 13.6496 14.5545 12.3096 14.5545H11.3096V16.5545H12.3096C14.1876 16.5545 15.8996 18.2685 15.8996 20.1505V21.1505H17.8996V20.1505C17.8996 18.2685 19.6156 16.5545 21.4996 16.5545H22.4996V14.5545H21.4996Z" fill={color} />
    <Path d="M12.19 9.44512H13.19V7.44512H12.19C10.311 7.44512 8.599 5.73112 8.599 3.84912V2.84912H6.599V3.84912C6.599 5.73112 4.883 7.44512 3 7.44512H2V9.44512H3C4.343 9.44512 5.61 8.91112 6.599 8.05612V18.7891H8.599V8.05912C9.586 8.91312 10.85 9.44512 12.19 9.44512Z" fill={color} />
  </Svg>
);

export default SwapSharpBoldIcon;
