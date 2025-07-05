import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * WorkSharpBrokenIcon component
 */
export const WorkSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M18.248 20.6999H21.285L21.475 15.1929"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2549 17.226V14.689"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M3.03516 15.1929L3.22516 20.6999H14.4322"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M5.10888 13.3959C4.35888 13.1009 3.65488 12.7599 3.00488 12.3799V5.87988H21.4949V12.3799C19.0349 13.8199 15.7849 14.6899 12.2449 14.6899C10.9509 14.6899 9.69588 14.5729 8.50588 14.3549"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.7549 5.6108L14.7549 3.2998H9.75488L8.75488 5.6108"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default WorkSharpBrokenIcon;
