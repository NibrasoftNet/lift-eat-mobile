import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DownloadCurvedTwoToneIcon component
 */
export const DownloadCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.8794 14.791V2.75"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.7954 11.8643L11.8794 14.7923L8.96338 11.8643"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.3705 7.25879C19.9495 7.58879 21.2505 8.92879 21.2505 14.2588C21.2505 21.3588 18.9395 21.3588 12.0005 21.3588C5.05949 21.3588 2.75049 21.3588 2.75049 14.2588C2.75049 8.92879 4.05049 7.58879 7.63049 7.25879"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default DownloadCurvedTwoToneIcon;
