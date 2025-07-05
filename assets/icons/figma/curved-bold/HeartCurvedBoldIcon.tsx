import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HeartCurvedBoldIcon component
 */
export const HeartCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M17.9068 10.698H17.8818C17.4678 10.683 17.1428 10.337 17.1568 9.92304C17.1888 8.97204 16.7238 8.35504 15.9128 8.27204C15.5008 8.23004 15.2008 7.86204 15.2428 7.45004C15.2858 7.03904 15.6558 6.73604 16.0658 6.78004C17.6738 6.94404 18.7148 8.22704 18.6558 9.97304C18.6418 10.379 18.3088 10.698 17.9068 10.698ZM17.8248 3.28404C16.1048 2.73404 13.7238 2.96204 12.2378 4.64804C10.6768 2.97404 8.37679 2.73104 6.66879 3.28504C2.75379 4.54504 1.53279 9.08104 2.64679 12.56V12.561C4.40479 18.032 10.2498 20.983 12.2518 20.983C14.0388 20.983 20.1158 18.087 21.8538 12.56C22.9678 9.08204 21.7438 4.54604 17.8248 3.28404Z"
      fill={color}
    />
  </Svg>
);

export default HeartCurvedBoldIcon;
