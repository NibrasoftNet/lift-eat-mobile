import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeCircleRegularBoldIcon component
 */
export const TimeCircleRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 22.0001C6.48 22.0001 2 17.5301 2 12.0001C2 6.48012 6.48 2.00012 12 2.00012C17.53 2.00012 22 6.48012 22 12.0001C22 17.5301 17.53 22.0001 12 22.0001ZM15.19 15.7101C15.31 15.7801 15.44 15.8201 15.58 15.8201C15.83 15.8201 16.08 15.6901 16.22 15.4501C16.43 15.1001 16.32 14.6401 15.96 14.4201L12.4 12.3001V7.68012C12.4 7.26012 12.06 6.93012 11.65 6.93012C11.24 6.93012 10.9 7.26012 10.9 7.68012V12.7301C10.9 12.9901 11.04 13.2301 11.27 13.3701L15.19 15.7101Z"
      fill={color}
    />
  </Svg>
);

export default TimeCircleRegularBoldIcon;
