import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSquareSharpBulkIcon component
 */
export const ArrowLeftSquareSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path d="M2.5 21.75L2.5 2.25L22 2.25L22 21.75L2.5 21.75Z" fill={color} />
    <Path
      d="M11.9299 16.811L7.10094 12L11.9299 7.18904L12.9879 8.25203L9.97894 11.25L17.0859 11.25L17.0859 12.75L9.97894 12.75L12.9879 15.748L11.9299 16.811Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeftSquareSharpBulkIcon;
