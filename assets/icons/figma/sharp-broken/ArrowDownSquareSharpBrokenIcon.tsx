import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownSquareSharpBrokenIcon component
 */
export const ArrowDownSquareSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 15.3635V7.93945"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16 12.3472L12.25 16.1112L8.5 12.3472"
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

export default ArrowDownSquareSharpBrokenIcon;
