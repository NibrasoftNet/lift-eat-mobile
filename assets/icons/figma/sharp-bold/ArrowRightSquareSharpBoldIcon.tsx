import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSquareSharpBoldIcon component
 */
export const ArrowRightSquareSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M12.567 16.809L11.509 15.746L14.522 12.75H7.41V11.25H14.522L11.509 8.255L12.567 7.192L17.403 12L12.567 16.809ZM2.5 21.75H22V2.25H2.5V21.75Z" fill={color} />
  </Svg>
);

export default ArrowRightSquareSharpBoldIcon;
