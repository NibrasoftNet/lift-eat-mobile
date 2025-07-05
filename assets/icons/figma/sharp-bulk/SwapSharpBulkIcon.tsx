import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SwapSharpBulkIcon component
 */
export const SwapSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.19 9.44561H13.19V7.44561H12.19C10.311 7.44561 8.599 5.73161 8.599 3.84961V2.84961H6.599V3.84961C6.599 5.73161 4.883 7.44561 3 7.44561H2V9.44561H3C4.343 9.44561 5.61 8.91161 6.599 8.05661V18.7896H8.599V8.05961C9.586 8.91361 10.85 9.44561 12.19 9.44561Z"
      fill={color}
    />
    <Path
      d="M21.5001 14.555C20.1561 14.555 18.8901 15.089 17.9001 15.944V5.20996H15.9001V15.941C14.9131 15.087 13.6501 14.555 12.3101 14.555H11.3101V16.555H12.3101C14.1881 16.555 15.9001 18.269 15.9001 20.151V21.151H17.9001V20.151C17.9001 18.269 19.6161 16.555 21.5001 16.555H22.5001V14.555H21.5001Z"
      fill={color}
    />
  </Svg>
);

export default SwapSharpBulkIcon;
