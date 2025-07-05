import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSquareSharpBoldIcon component
 */
export const ArrowUpSquareSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M15.998 12.739L13 9.73V16.836H11.5V9.73L8.502 12.739L7.439 11.68L12.25 6.852L17.06 11.68L15.998 12.739ZM2.5 21.75H22V2.25H2.5V21.75Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpSquareSharpBoldIcon;
