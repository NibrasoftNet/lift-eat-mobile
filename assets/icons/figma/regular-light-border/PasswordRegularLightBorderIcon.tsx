import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PasswordRegularLightBorderIcon component
 */
export const PasswordRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.334 2.75012H7.665C4.644 2.75012 2.75 4.88912 2.75 7.91612V16.0841C2.75 19.1111 4.635 21.2501 7.665 21.2501H16.333C19.364 21.2501 21.25 19.1111 21.25 16.0841V7.91612C21.25 4.88912 19.364 2.75012 16.334 2.75012Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.6919 12.0001H17.0099V13.8521"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.1816 13.8522V12.0002"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.6889 12.0001C10.6889 13.0231 9.85986 13.8521 8.83686 13.8521C7.81386 13.8521 6.98486 13.0231 6.98486 12.0001C6.98486 10.9771 7.81386 10.1481 8.83686 10.1481H8.83986C9.86086 10.1491 10.6889 10.9781 10.6889 12.0001Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PasswordRegularLightBorderIcon;
