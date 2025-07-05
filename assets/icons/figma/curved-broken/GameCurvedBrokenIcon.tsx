import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GameCurvedBrokenIcon component
 */
export const GameCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.9441 15.8203H16.8421"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.99121 12.2998V15.8748"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.815 14.0869H7.16797"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.2131 12.4082H15.1111"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.0011 21.5468C19.1611 21.5468 21.5481 19.6937 21.5481 14.1328C21.5481 8.57275 19.1611 6.71875 12.0011 6.71875C4.83915 6.71875 2.45215 8.57275 2.45215 14.1328C2.45215 18.2678 3.77215 20.3517 7.39215 21.1497"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.25 2.45312C8.257 3.16712 8.842 3.74012 9.556 3.73312H10.564C11.667 3.72512 12.569 4.60912 12.584 5.71112V6.71812"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default GameCurvedBrokenIcon;
