import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CalendarSharpBrokenIcon component
 */
export const CalendarSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M16.3578 17.3413H16.3658"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2528 17.3413H12.2618"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.13954 17.3413H8.14854"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.3578 13.7461H16.3658"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2528 13.7461H12.2618"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.13954 13.7461H8.14854"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M4.00977 10.1338H17.8408"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.9897 3.28467V6.32867"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.51807 3.28467V6.32867"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M5.8638 4.74561H3.9248V21.7846H20.5748V4.74561H16.0658"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.0113 4.74561H8.52832"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CalendarSharpBrokenIcon;
