import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSquareCurvedBoldIcon component
 */
export const ArrowRightSquareCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.987 16.371C12.859 16.457 12.715 16.498 12.571 16.498C12.329 16.498 12.091 16.382 11.947 16.165C11.716 15.821 11.808 15.355 12.153 15.125C13.335 14.333 14.435 13.418 15.06 12.75H8.16C7.746 12.75 7.41 12.414 7.41 12C7.41 11.586 7.746 11.25 8.16 11.25H15.062C14.432 10.582 13.319 9.653 12.152 8.871C11.808 8.641 11.716 8.174 11.947 7.83C12.177 7.486 12.641 7.394 12.988 7.625C14.221 8.452 17.09 10.534 17.09 12C17.09 13.466 14.22 15.545 12.987 16.371ZM12.25 2.25C5.051 2.25 2.5 4.802 2.5 12C2.5 19.198 5.051 21.75 12.25 21.75C19.448 21.75 22 19.198 22 12C22 4.802 19.448 2.25 12.25 2.25Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRightSquareCurvedBoldIcon;
