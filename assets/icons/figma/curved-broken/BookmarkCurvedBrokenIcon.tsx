import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BookmarkCurvedBrokenIcon component
 */
export const BookmarkCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M8.57227 9.21777H15.4273" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M19.449 9.461C19.291 3.307 17.944 2.5 12 2.5C5.61303 2.5 4.53403 3.432 4.53403 10.929C4.53403 19.322 4.37703 21.5 5.97303 21.5C7.56803 21.5 10.173 17.816 12 17.816C13.827 17.816 16.432 21.5 18.027 21.5C19.383 21.5 19.474 19.928 19.47 14.311" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default BookmarkCurvedBrokenIcon;
