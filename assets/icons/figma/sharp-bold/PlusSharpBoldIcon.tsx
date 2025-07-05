import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlusSharpBoldIcon component
 */
export const PlusSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M16.667 13.2747H13V16.9387H11.5V13.2747H7.834V11.7747H11.5V8.11167H13V11.7747H16.667V13.2747ZM2.5 22.2847H22V2.78467H2.5V22.2847Z"
      fill={color}
    />
  </Svg>
);

export default PlusSharpBoldIcon;
