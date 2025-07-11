import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DangerCircleSharpBrokenIcon component
 */
export const DangerCircleSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M21.5 12.5347C21.5 17.6427 17.358 21.7847 12.25 21.7847C7.141 21.7847 3 17.6427 3 12.5347C3 7.42567 7.141 3.28467 12.25 3.28467C15.161 3.28467 17.759 4.62967 19.455 6.73267"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.245 16.3306H12.255"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2451 8.73877V13.1578"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default DangerCircleSharpBrokenIcon;
