import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Upload1SharpBoldIcon component
 */
export const Upload1SharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M13 4.31401L15.528 6.85001L16.591 5.79101L12.249 1.43701L7.92004 5.79301L8.98304 6.85001L11.5 4.31801V10.519H13V4.31401Z"
      fill={color}
    />
    <Path
      d="M13 10.519L13 16.7787H11.5L11.5 10.519L2.5 10.5187V22.0387H22V10.5187L13 10.519Z"
      fill={color}
    />
  </Svg>
);

export default Upload1SharpBoldIcon;
