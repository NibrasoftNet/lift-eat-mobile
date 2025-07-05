import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown3SharpBrokenIcon component
 */
export const ArrowDown3SharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path d="M12.25 20V10.041" fill={none} stroke={color} strokeWidth="1.5" />
    <Path
      d="M17.91 14.3403C15 14.3403 12.25 16.9023 12.25 20.0003"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.58984 14.3403C9.49984 14.3403 12.2498 16.9023 12.2498 20.0003"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M12.25 6.532V4" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ArrowDown3SharpBrokenIcon;
