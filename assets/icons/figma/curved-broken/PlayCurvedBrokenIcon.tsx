import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlayCurvedBrokenIcon component
 */
export const PlayCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.325 2.75391C4.912 2.90491 2.75 5.28891 2.75 11.9959C2.75 18.9329 5.063 21.2459 12 21.2459C18.937 21.2459 21.25 18.9329 21.25 11.9959C21.25 5.95291 19.495 3.41891 14.455 2.86591"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.4159 11.8517C15.4159 10.9477 10.8319 8.05575 10.3119 8.57575C9.79292 9.09575 9.74192 14.5587 10.3119 15.1277C10.8829 15.6987 15.4159 12.7557 15.4159 11.8517Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PlayCurvedBrokenIcon;
