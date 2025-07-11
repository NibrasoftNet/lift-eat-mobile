import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft3RegularBoldIcon component
 */
export const ArrowLeft3RegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.8585 17.4101C12.0925 17.2839 12.2384 17.0438 12.2384 16.7827V12.7173H20.2657C20.671 12.7173 21 12.396 21 12C21 11.6041 20.671 11.2828 20.2657 11.2828H12.2384V7.21731C12.2384 6.95527 12.0925 6.71523 11.8585 6.58995C11.6245 6.46275 11.3386 6.47136 11.1125 6.61003L3.34267 11.3927C3.12924 11.5247 3 11.7533 3 12C3 12.2468 3.12924 12.4753 3.34267 12.6073L11.1125 17.39C11.2319 17.4627 11.368 17.5 11.5041 17.5C11.6255 17.5 11.7479 17.4694 11.8585 17.4101Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeft3RegularBoldIcon;
