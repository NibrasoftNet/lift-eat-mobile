import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DownloadSharpBulkIcon component
 */
export const DownloadSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M2.5 21.2591L2.5 8.82861L22 8.82861L22 21.2591L2.5 21.2591Z"
      fill={color}
    />
    <Path
      d="M11.5003 17.6835C11.4993 15.6715 9.6673 13.8395 7.6543 13.8395L6.9043 13.8395L6.9043 12.3395L7.6543 12.3395C9.1313 12.3395 10.5113 13.0145 11.5003 14.0585L11.5002 3.01818L13.0002 3.01818L13.0003 14.0585C13.9893 13.0145 15.3683 12.3395 16.8453 12.3395L17.5953 12.3395L17.5953 13.8395L16.8453 13.8395C14.8333 13.8395 13.0003 15.6725 13.0003 17.6845L13.0003 18.4345L11.5003 18.4345L11.5003 17.6835Z"
      fill={color}
    />
  </Svg>
);

export default DownloadSharpBulkIcon;
