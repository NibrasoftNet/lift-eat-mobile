import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UploadSharpBulkIcon component
 */
export const UploadSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M2.5 10.9654L2.5 22.4854L22 22.4854L22 10.9654L2.5 10.9654Z"
      fill={color}
    />
    <Path
      d="M11.5003 2.54307C11.4993 4.55507 9.6673 6.38707 7.6543 6.38707L6.9043 6.38707L6.9043 7.88707L7.6543 7.88707C9.1313 7.88707 10.5113 7.21207 11.5003 6.16807L11.5002 17.2084L13.0002 17.2084L13.0003 6.16807C13.9893 7.21207 15.3683 7.88707 16.8453 7.88707L17.5953 7.88707L17.5953 6.38707L16.8453 6.38707C14.8333 6.38707 13.0003 4.55407 13.0003 2.54207L13.0003 1.79207L11.5003 1.79207L11.5003 2.54307Z"
      fill={color}
    />
  </Svg>
);

export default UploadSharpBulkIcon;
