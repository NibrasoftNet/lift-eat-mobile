import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BookmarkSharpBulkIcon component
 */
export const BookmarkSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M4.27197 2.10889V21.8889L12.274 18.2139L20.228 21.8909V2.10889H4.27197Z" fill={color} />
    <Path d="M16.522 9.83398H7.979V8.33398H16.522V9.83398Z" fill={color} />
  </Svg>
);

export default BookmarkSharpBulkIcon;
