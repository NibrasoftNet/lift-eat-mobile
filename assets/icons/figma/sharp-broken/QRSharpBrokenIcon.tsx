import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * QRSharpBrokenIcon component
 */
export const QRSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M6.90234 17.4139V17.5109"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.0003 20.8656H14.1943V14.0596H21.0003V17.7796"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.5977 17.4139V17.5109"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M3.5 20.8656V14.0596H10.306V20.8656L7.015 20.9106"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.6253 4.11621H17.3753V2.61621H16.6253V4.11621ZM14.1953 3.36621V2.61621H13.4453V3.36621H14.1953ZM13.4453 7.48621V8.23621H14.9453V7.48621H13.4453ZM20.2503 5.06721V5.81721H21.7503V5.06721H20.2503ZM21.0003 3.36621H21.7503V2.61621H21.0003V3.36621ZM19.2993 2.61621H18.5493V4.11621H19.2993V2.61621ZM21.7503 7.74121V6.99121H20.2503V7.74121H21.7503ZM21.0003 10.1712V10.9212H21.7503V10.1712H21.0003ZM19.2993 9.42121H18.5493V10.9212H19.2993V9.42121ZM14.1953 9.42121H13.4453V10.9212H14.1953V9.42121ZM16.4153 10.9212H17.1653V9.42121H16.4153V10.9212ZM16.6253 2.61621H14.1953V4.11621H16.6253V2.61621ZM13.4453 3.36621V7.48621H14.9453V3.36621H13.4453ZM21.7503 5.06721V3.36621H20.2503V5.06721H21.7503ZM21.0003 2.61621H19.2993V4.11621H21.0003V2.61621ZM20.2503 7.74121V10.1712H21.7503V7.74121H20.2503ZM21.0003 9.42121H19.2993V10.9212H21.0003V9.42121ZM14.1953 10.9212H16.4153V9.42121H14.1953V10.9212Z"
      fill={color}
    />
    <Path
      d="M16.5176 5.73096V7.94996H18.3466"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.9438 5.72107V5.73107"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.306 3.36621V10.1722H3.5V3.36621H6.632"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.90234 6.72005V6.81705"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default QRSharpBrokenIcon;
