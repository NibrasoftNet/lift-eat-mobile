import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FolderSharpBrokenIcon component
 */
export const FolderSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M7.88232 15.0864H16.6173"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.123 20.3263H3V3.67334H9.963L12.225 6.45234H21.5V20.3263"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default FolderSharpBrokenIcon;
