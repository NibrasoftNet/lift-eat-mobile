import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeSquareSharpBrokenIcon component
 */
export const TimeSquareSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M15.641 14.0178L12.25 11.9948V7.63379"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.457 21.25H21.5V2.75H3V21.25H5.858"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default TimeSquareSharpBrokenIcon;
