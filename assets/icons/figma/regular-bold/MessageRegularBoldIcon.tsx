import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MessageRegularBoldIcon component
 */
export const MessageRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.9395 3C18.2805 3 19.5705 3.53 20.5195 4.481C21.4695 5.43 22.0005 6.71 22.0005 8.05V15.95C22.0005 18.74 19.7305 21 16.9395 21H7.06049C4.26949 21 2.00049 18.74 2.00049 15.95V8.05C2.00049 5.26 4.25949 3 7.06049 3H16.9395ZM18.5305 9.54L18.6105 9.46C18.8495 9.17 18.8495 8.75 18.5995 8.46C18.4605 8.311 18.2695 8.22 18.0705 8.2C17.8605 8.189 17.6605 8.26 17.5095 8.4L13.0005 12C12.4205 12.481 11.5895 12.481 11.0005 12L6.50049 8.4C6.18949 8.17 5.75949 8.2 5.50049 8.47C5.23049 8.74 5.20049 9.17 5.42949 9.47L5.56049 9.6L10.1105 13.15C10.6705 13.59 11.3495 13.83 12.0605 13.83C12.7695 13.83 13.4605 13.59 14.0195 13.15L18.5305 9.54Z"
      fill={color}
    />
  </Svg>
);

export default MessageRegularBoldIcon;
