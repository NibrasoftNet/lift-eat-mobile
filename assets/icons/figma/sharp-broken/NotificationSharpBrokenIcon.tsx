import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * NotificationSharpBrokenIcon component
 */
export const NotificationSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M18.4372 13.518L20.0502 17.857H4.44922L6.06222 13.518V8.937C6.06222 5.52 8.83222 2.75 12.2502 2.75C15.6672 2.75 18.4372 5.52 18.4372 8.937"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.417 17.8569V18.0829C15.417 19.8319 14 21.2499 12.251 21.2499C10.502 21.2499 9.08398 19.8319 9.08398 18.0829V17.8569"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default NotificationSharpBrokenIcon;
