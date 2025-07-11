import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightCircleCurvedBrokenIcon component
 */
export const ArrowRightCircleCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15.009 21.059C19.626 20.382 21.25 17.817 21.25 12C21.25 5.063 18.94 2.75 12 2.75C5.06 2.75 2.75 5.063 2.75 12C2.75 18.937 5.06 21.25 12 21.25"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.5596 15.4713C10.5596 15.4713 14.0396 13.0793 14.0396 11.9993C14.0396 10.9193 10.5596 8.5293 10.5596 8.5293"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowRightCircleCurvedBrokenIcon;
