import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Notification2SharpBrokenIcon component
 */
export const Notification2SharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M4.44922 15.4269V18.1309H20.0502V15.4269L18.4372 13.7919V10.2119"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.417 18.1309V18.3569C15.417 20.1059 14 21.5239 12.251 21.5239C10.502 21.5239 9.08398 20.1059 9.08398 18.3569V18.1309"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2505 3.02393C8.8325 3.02393 6.0625 5.79393 6.0625 9.21193V13.7919"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.9331 5.09793C18.9331 6.39293 17.8831 7.44293 16.5881 7.44293C15.2931 7.44293 14.2441 6.39293 14.2441 5.09793C14.2441 3.80293 15.2931 2.75293 16.5881 2.75293"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Notification2SharpBrokenIcon;
