import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HeartSharpBoldIcon component
 */
export const HeartSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M17.6911 3.37104C15.5951 2.69404 13.6841 3.25804 12.2501 4.95404C10.8151 3.25604 8.90409 2.69504 6.81009 3.37104C4.16309 4.22304 2.51209 6.61404 2.50009 9.61004C2.47609 14.744 7.41709 18.766 12.0481 20.818L12.2511 20.908L12.4541 20.818C17.0861 18.766 22.0251 14.744 22.0001 9.61004C21.9881 6.61404 20.3371 4.22304 17.6911 3.37104Z"
      fill={color}
    />
  </Svg>
);

export default HeartSharpBoldIcon;
