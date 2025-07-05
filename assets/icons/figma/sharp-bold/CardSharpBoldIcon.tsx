import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CardSharpBoldIcon component
 */
export const CardSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M14.352 16.2304H19.327V14.7304H14.352V16.2304ZM10.126 16.2304H12.374V14.7304H10.126V16.2304ZM2.5 19.6684H22V10.6714H2.5V19.6684Z"
      fill={color}
    />
    <Path d="M2.5 9.1714H22V4.6084H2.5V9.1714Z" fill={color} />
  </Svg>
);

export default CardSharpBoldIcon;
