import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSquareSharpBulkIcon component
 */
export const ArrowUpSquareSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path d="M2.5 2.25H22V21.75H2.5V2.25Z" fill={color} />
    <Path
      d="M7.43896 11.6799L12.25 6.85094L17.061 11.6799L15.998 12.7379L13 9.72894V16.8359H11.5V9.72894L8.50196 12.7379L7.43896 11.6799Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpSquareSharpBulkIcon;
