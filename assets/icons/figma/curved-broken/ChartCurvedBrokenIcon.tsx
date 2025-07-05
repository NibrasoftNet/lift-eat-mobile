import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ChartCurvedBrokenIcon component
 */
export const ChartCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.4795 13.7617V16.9187"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.44629 10.2236V16.9176"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12 7.02051V16.9185"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.0002 21.7367C4.69818 21.7367 2.26318 19.3017 2.26318 11.9997C2.26318 4.6977 4.69818 2.2627 12.0002 2.2627C19.3022 2.2627 21.7372 4.6977 21.7372 11.9997C21.7372 17.6977 20.2552 20.4317 16.1342 21.3587"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ChartCurvedBrokenIcon;
