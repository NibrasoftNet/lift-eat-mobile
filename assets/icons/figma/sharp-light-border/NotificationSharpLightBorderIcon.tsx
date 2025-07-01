import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * NotificationSharpLightBorderIcon component
 */
export const NotificationSharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M15.4173 17.8574V18.0834C15.4173 19.8323 13.9996 21.2501 12.2507 21.2501C10.5017 21.2501 9.08398 19.8323 9.08398 18.0834V17.8574" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M6.06186 8.93778C6.06186 5.52036 8.83222 2.75 12.2496 2.75C15.667 2.75 18.4374 5.52036 18.4374 8.93777V13.5184L20.05 17.8572H4.44922L6.06186 13.5184V8.93778Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default NotificationSharpLightBorderIcon;
