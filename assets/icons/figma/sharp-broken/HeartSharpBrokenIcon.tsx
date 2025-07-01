import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HeartSharpBrokenIcon component
 */
export const HeartSharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M21.5001 9.63556C21.4901 7.09956 20.1601 4.71456 17.5371 3.86956C15.7361 3.28856 13.7741 3.61156 12.2501 5.79956C10.7261 3.61156 8.76408 3.28856 6.96308 3.86956C4.34008 4.71456 3.01008 7.10056 3.00008 9.63656C2.97608 14.6806 8.08708 18.5396 12.2491 20.3846L12.2501 20.3836L12.2511 20.3846C14.9631 19.1826 18.0771 17.1256 19.9121 14.4436" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default HeartSharpBrokenIcon;
