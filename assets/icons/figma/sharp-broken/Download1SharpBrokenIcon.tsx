import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Download1SharpBrokenIcon component
 */
export const Download1SharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 15.9352V3.15723"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.98047 13.395L12.2505 16.685L15.5305 13.395"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.88 9.41406H21.5V20.8431H3V9.41406H7.62"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Download1SharpBrokenIcon;
