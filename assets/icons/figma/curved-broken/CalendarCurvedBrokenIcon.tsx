import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CalendarCurvedBrokenIcon component
 */
export const CalendarCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.9996 21.9998C5.04459 21.9998 2.72559 19.6818 2.72559 12.7258C2.72559 8.59881 3.54159 6.10381 5.65859 4.75781"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.021 3.83105C19.883 4.73105 21.275 7.33606 21.275 12.7261C21.275 18.5821 19.631 21.1511 14.96 21.8171"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.4037 17.0625H16.4127"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.0043 17.0625H12.0133"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.59657 17.0625H7.60557"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.4037 13.2109H16.4127"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.0043 13.2109H12.0133"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.59657 13.2109H7.60557"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M3.00049 9.27344H21.0085"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.16162 3.78664C8.45262 3.70564 8.15862 3.78564 8.48062 3.72564C9.49262 3.53764 10.6606 3.45164 11.9996 3.45164C12.6446 3.45164 13.2496 3.47164 13.8166 3.51264"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M16.0088 2V5.262" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.00049 2V5.262" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default CalendarCurvedBrokenIcon;
