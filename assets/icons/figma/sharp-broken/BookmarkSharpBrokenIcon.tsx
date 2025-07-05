import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BookmarkSharpBrokenIcon component
 */
export const BookmarkSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M13.038 2.75H4.77197V21.25L12.275 17.804L19.728 21.25V2.75H17.308"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.72803 9.22559H15.772"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default BookmarkSharpBrokenIcon;
