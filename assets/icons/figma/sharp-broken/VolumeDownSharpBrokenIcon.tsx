import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeDownSharpBrokenIcon component
 */
export const VolumeDownSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M18.564 7.99561C19.99 10.4856 19.99 13.5256 18.564 16.0076"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.24895 8.0643L13.3749 4.4873H14.1509V19.5133H13.3749L9.24895 15.9363H4.86895C4.86595 13.3123 4.86595 10.6883 4.86895 8.0643"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default VolumeDownSharpBrokenIcon;
