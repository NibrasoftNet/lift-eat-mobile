import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeSquareSharpBoldIcon component
 */
export const TimeSquareSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M15.901 15.046L11.5 12.421V6.883H13V11.569L16.67 13.758L15.901 15.046ZM2.5 21.75H22V2.25H2.5V21.75Z"
      fill={color}
    />
  </Svg>
);

export default TimeSquareSharpBoldIcon;
