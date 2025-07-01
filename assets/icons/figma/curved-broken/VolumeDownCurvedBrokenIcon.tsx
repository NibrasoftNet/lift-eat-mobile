import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeDownCurvedBrokenIcon component
 */
export const VolumeDownCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M18.5096 8.34668C19.7626 10.6177 19.7626 13.3887 18.5096 15.6517" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M5.52679 8.49712C4.52079 9.35112 4.51779 10.7811 4.52079 11.9991C4.51779 13.2181 4.52079 14.6471 5.52679 15.5021C6.53379 16.3571 7.33279 16.0041 8.63479 16.4321C9.93779 16.8621 11.7628 19.5091 13.7788 18.3131C14.8688 17.5391 15.3828 16.0781 15.3828 11.9991C15.3828 7.92112 14.8918 6.47612 13.7788 5.68612C11.7628 4.49112 9.93779 7.13812 8.63479 7.56712" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default VolumeDownCurvedBrokenIcon;
