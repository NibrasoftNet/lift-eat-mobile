import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeCircleRegularBulkIcon component
 */
export const TimeCircleRegularBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M22 11.9999C22 17.5239 17.523 21.9999 12 21.9999C6.477 21.9999 2 17.5239 2 11.9999C2 6.47788 6.477 1.99988 12 1.99988C17.523 1.99988 22 6.47788 22 11.9999Z" fill={color} />
    <Path d="M15.5739 15.8144C15.4429 15.8144 15.3109 15.7804 15.1899 15.7094L11.2639 13.3674C11.0379 13.2314 10.8989 12.9864 10.8989 12.7224V7.67542C10.8989 7.26142 11.2349 6.92542 11.6489 6.92542C12.0629 6.92542 12.3989 7.26142 12.3989 7.67542V12.2964L15.9589 14.4194C16.3139 14.6324 16.4309 15.0924 16.2189 15.4484C16.0779 15.6834 15.8289 15.8144 15.5739 15.8144Z" fill={color} />
  </Svg>
);

export default TimeCircleRegularBulkIcon;
