import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SearchSharpTwoToneIcon component
 */
export const SearchSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M16.7373 16.7085L21.2908 21.2501"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Circle cx="11.2485" cy="10.7885" r="8.03854" fill='none' stroke={color} />
  </Svg>
);

export default SearchSharpTwoToneIcon;
