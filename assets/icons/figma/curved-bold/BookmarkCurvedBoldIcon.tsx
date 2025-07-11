import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BookmarkCurvedBoldIcon component
 */
export const BookmarkCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M15.677 9.968H8.82199C8.40799 9.968 8.07199 9.632 8.07199 9.218C8.07199 8.804 8.40799 8.468 8.82199 8.468H15.677C16.091 8.468 16.427 8.804 16.427 9.218C16.427 9.632 16.091 9.968 15.677 9.968ZM20.219 12.99L20.216 10.929C20.216 3.335 19.025 2 12.25 2C5.47499 2 4.28399 3.335 4.28399 10.929L4.28099 12.99C4.27199 18.615 4.26799 20.721 5.12699 21.58C5.40499 21.859 5.77399 22 6.22299 22C7.17799 22 8.23999 21.093 9.36499 20.132C10.361 19.281 11.49 18.317 12.25 18.317C13.01 18.317 14.139 19.281 15.135 20.132C16.26 21.093 17.322 22 18.277 22C18.726 22 19.095 21.859 19.373 21.58C20.232 20.721 20.228 18.615 20.219 12.99Z"
      fill={color}
    />
  </Svg>
);

export default BookmarkCurvedBoldIcon;
