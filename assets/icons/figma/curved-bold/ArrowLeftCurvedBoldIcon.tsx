import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftCurvedBoldIcon component
 */
export const ArrowLeftCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M19.75 11.0003H6.117C7.023 9.58133 9.444 7.84433 11.274 6.85533C11.761 6.59333 11.941 5.98633 11.68 5.50133C11.417 5.01633 10.812 4.83233 10.325 5.09633C9.228 5.68733 3.755 8.80033 3.75 11.9983C3.75 11.9993 3.75 11.9993 3.75 12.0003V12.0023C3.75 15.1993 9.228 18.3123 10.325 18.9043C10.477 18.9863 10.639 19.0243 10.799 19.0243C11.154 19.0243 11.499 18.8343 11.68 18.4993C11.941 18.0143 11.761 17.4063 11.274 17.1453C9.443 16.1553 7.02 14.4183 6.115 13.0003H19.75C20.303 13.0003 20.75 12.5533 20.75 12.0003C20.75 11.4473 20.303 11.0003 19.75 11.0003Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeftCurvedBoldIcon;
