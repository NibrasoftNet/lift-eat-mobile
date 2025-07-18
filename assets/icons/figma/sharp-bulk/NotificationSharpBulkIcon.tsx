import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * NotificationSharpBulkIcon component
 */
export const NotificationSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M18.9375 13.304L20.7695 18.232H3.73047L5.56247 13.304V8.813C5.56247 5.125 8.56247 2.125 12.2505 2.125C15.9375 2.125 18.9375 5.125 18.9375 8.813V13.304Z"
      fill={color}
    />
    <Path
      d="M16.1398 18.2319H14.6398C14.5018 19.4349 13.4898 20.3749 12.2518 20.3749C11.0128 20.3749 10.0008 19.4349 9.86279 18.2319H8.36279C8.50579 20.2619 10.1858 21.8749 12.2518 21.8749C14.3168 21.8749 15.9968 20.2619 16.1398 18.2319Z"
      fill={color}
    />
  </Svg>
);

export default NotificationSharpBulkIcon;
