import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CloseSquareCurvedBrokenIcon component
 */
export const CloseSquareCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.3901 9.59473L9.6001 14.3867"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.4001 14.3938L9.6001 9.59375"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.572 20.965C19.759 20.163 21.25 17.574 21.25 12C21.25 5.063 18.94 2.75 12 2.75C5.06 2.75 2.75 5.063 2.75 12C2.75 18.937 5.06 21.25 12 21.25"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CloseSquareCurvedBrokenIcon;
