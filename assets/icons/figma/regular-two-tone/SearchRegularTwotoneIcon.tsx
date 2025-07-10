import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SearchRegularTwotoneIcon component
 */
export const SearchRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M18.0181 18.4851L21.5421 22"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Circle cx="11.7664" cy="11.7666" r="8.98856" fill='none' stroke={color} />
  </Svg>
);

export default SearchRegularTwotoneIcon;
