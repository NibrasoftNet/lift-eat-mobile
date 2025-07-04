import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BookmarkCurvedBulkIcon component
 */
export const BookmarkCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M20.219 12.99L20.216 10.929C20.216 3.335 19.025 2 12.25 2C5.47499 2 4.28399 3.335 4.28399 10.929L4.28099 12.99C4.27199 18.615 4.26799 20.721 5.12699 21.58C5.40499 21.859 5.77399 22 6.22299 22C7.17799 22 8.23999 21.093 9.36499 20.132C10.361 19.281 11.49 18.317 12.25 18.317C13.01 18.317 14.139 19.281 15.135 20.132C16.26 21.093 17.322 22 18.277 22C18.726 22 19.095 21.859 19.373 21.58C20.232 20.721 20.228 18.615 20.219 12.99Z"
      fill={color}
    />
    <Path
      d="M8.82227 9.96777H15.6773C16.0913 9.96777 16.4273 9.63177 16.4273 9.21777C16.4273 8.80377 16.0913 8.46777 15.6773 8.46777H8.82227C8.40827 8.46777 8.07227 8.80377 8.07227 9.21777C8.07227 9.63177 8.40827 9.96777 8.82227 9.96777Z"
      fill={color}
    />
  </Svg>
);

export default BookmarkCurvedBulkIcon;
