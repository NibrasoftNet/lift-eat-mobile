import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftCircleSharpBulkIcon component
 */
export const ArrowLeftCircleSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M22 12C22 17.376 17.626 21.75 12.25 21.75C6.874 21.75 2.5 17.376 2.5 12C2.5 6.624 6.874 2.25 12.25 2.25C17.626 2.25 22 6.624 22 12Z"
      fill={color}
    />
    <Path
      d="M13.6949 16.5298L9.14393 11.9998L13.6949 7.46978L14.7529 8.53278L11.2699 11.9998L14.7529 15.4668L13.6949 16.5298Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeftCircleSharpBulkIcon;
