import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LockCurvedBrokenIcon component
 */
export const LockCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.9995 14.0977V16.3187"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.5595 9.34476V7.19576C16.5295 4.67676 14.4595 2.66076 11.9395 2.69176C9.47945 2.72276 7.47945 4.70876 7.43945 7.17576V9.34476"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.5928 20.9966C18.5778 20.3406 19.6598 18.5766 19.6598 15.0366C19.6598 10.3336 17.7498 8.76562 11.9998 8.76562C6.25984 8.76562 4.33984 10.3336 4.33984 15.0366C4.33984 19.7406 6.25984 21.3086 11.9998 21.3086"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default LockCurvedBrokenIcon;
