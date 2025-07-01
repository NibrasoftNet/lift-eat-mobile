import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreSquareSharpBoldIcon component
 */
export const MoreSquareSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M16.949 13.2977H15.449L15.44 11.7977H16.949V13.2977ZM12.939 13.2977H11.439L11.43 11.7977H12.939V13.2977ZM8.93 13.2977H7.43L7.421 11.7977H8.93V13.2977ZM2.5 22.2847H22V2.78467H2.5V22.2847Z" fill={color} />
  </Svg>
);

export default MoreSquareSharpBoldIcon;
