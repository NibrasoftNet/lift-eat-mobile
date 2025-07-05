import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TicketCurvedBrokenIcon component
 */
export const TicketCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M13.3584 17.5439V19.7639"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.3584 14.5439V9.25488"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.171 3.63281C2.5 4.11281 2.5 5.94781 2.5 9.94981C5.191 9.94981 5.191 14.0518 2.5 14.0518C2.5 18.0298 2.5 19.8668 8.072 20.3598"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.3584 3.59961V6.25461"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.9995 20.5C21.4995 20.5 21.4995 18.804 21.4995 14.051C18.8085 14.051 18.8085 9.949 21.4995 9.949C21.4995 5.196 21.4995 3.5 11.9995 3.5"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default TicketCurvedBrokenIcon;
