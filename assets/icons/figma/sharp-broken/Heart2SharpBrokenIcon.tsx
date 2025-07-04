import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Heart2SharpBrokenIcon component
 */
export const Heart2SharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M20.0741 14.3372C20.9611 12.9642 21.5081 11.4332 21.5001 9.77423C21.4901 7.23823 20.1601 4.85323 17.5371 4.00823C15.7361 3.42723 13.7741 3.75023 12.2501 5.93823C10.7261 3.75023 8.76408 3.42723 6.96308 4.00823C4.34008 4.85423 3.01008 7.23923 3.00008 9.77523C2.97608 14.8192 8.08808 18.6782 12.2501 20.5232C13.9821 19.7552 15.8801 18.6382 17.5021 17.2332" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.9924 11.4292C15.2224 12.7522 13.8524 13.8222 12.2694 13.7942C10.6854 13.8222 9.31541 12.7522 8.54541 11.4292" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Heart2SharpBrokenIcon;
