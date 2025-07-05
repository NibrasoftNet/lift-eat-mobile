import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star7SharpBulkIcon component
 */
export const Star7SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M10.032 6.65396L12.25 1.48096V22.519L10.032 17.346L4.81103 19.44L6.90403 14.214L1.72803 12L6.90403 9.78596L4.81103 4.55996L10.032 6.65396Z"
      fill={color}
    />
    <Path
      d="M14.468 6.65396L12.25 1.48096V22.519L14.468 17.346L19.689 19.44L17.596 14.214L22.772 12L17.596 9.78596L19.689 4.55996L14.468 6.65396Z"
      fill={color}
    />
  </Svg>
);

export default Star7SharpBulkIcon;
