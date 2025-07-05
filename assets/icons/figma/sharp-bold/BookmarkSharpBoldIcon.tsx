import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BookmarkSharpBoldIcon component
 */
export const BookmarkSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M7.97897 9.83389H16.522V8.33389H7.97897V9.83389ZM4.27197 2.10889V21.8889L12.274 18.2139L20.228 21.8909V2.10889H4.27197Z"
      fill={color}
    />
  </Svg>
);

export default BookmarkSharpBoldIcon;
