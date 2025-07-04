import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown3CurvedBoldIcon component
 */
export const ArrowDown3CurvedBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M17.3383 12.8112C16.8033 12.2752 14.9913 12.0902 13.2463 12.0402V3.82324C13.2463 3.27024 12.7993 2.82324 12.2463 2.82324C11.6933 2.82324 11.2463 3.27024 11.2463 3.82324V12.0342C9.00931 12.0872 7.63931 12.3472 7.17531 12.8112C6.61231 13.3752 6.90131 14.3152 7.21531 15.0712C7.86631 16.6402 10.6123 21.1762 12.2573 21.1762C13.9523 21.1762 16.6893 16.4382 17.2863 14.9992C17.6113 14.2172 17.8713 13.3462 17.3383 12.8112Z" fill={color} />
  </Svg>
);

export default ArrowDown3CurvedBoldIcon;
