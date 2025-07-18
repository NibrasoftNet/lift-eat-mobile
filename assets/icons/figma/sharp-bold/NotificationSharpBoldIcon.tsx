import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * NotificationSharpBoldIcon component
 */
export const NotificationSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2515 20.375C11.0125 20.375 10.0005 19.435 9.86247 18.232H14.6395C14.5015 19.435 13.4895 20.375 12.2515 20.375ZM20.7695 18.232L18.9375 13.304V8.813C18.9375 5.125 15.9375 2.125 12.2505 2.125C8.56247 2.125 5.56247 5.125 5.56247 8.813V13.304L3.73047 18.232H8.36247C8.50547 20.262 10.1855 21.875 12.2515 21.875C14.3165 21.875 15.9965 20.262 16.1395 18.232H20.7695Z"
      fill={color}
    />
  </Svg>
);

export default NotificationSharpBoldIcon;
