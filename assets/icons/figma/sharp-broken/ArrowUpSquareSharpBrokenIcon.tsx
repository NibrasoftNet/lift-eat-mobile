import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSquareSharpBrokenIcon component
 */
export const ArrowUpSquareSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 8.64795V16.0719"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16 11.6639L12.25 7.8999L8.5 11.6639"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.5 6.177V2.75H3V21.25H21.5V11.403"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowUpSquareSharpBrokenIcon;
