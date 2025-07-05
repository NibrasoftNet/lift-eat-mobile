import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ChartSharpBrokenIcon component
 */
export const ChartSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M17.0864 14.1489V16.9919"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.41357 10.9624V16.9924"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2505 8.07715V16.9921"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.595 21.7847H21.5V3.28467H3V21.7847H8.344"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ChartSharpBrokenIcon;
