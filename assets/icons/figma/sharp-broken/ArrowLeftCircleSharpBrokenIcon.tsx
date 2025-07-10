import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftCircleSharpBrokenIcon component
 */
export const ArrowLeftCircleSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M16.443 20.248C19.445 18.719 21.5 15.6 21.5 12C21.5 6.891 17.36 2.75 12.25 2.75C7.14 2.75 3 6.891 3 12C3 17.108 7.14 21.25 12.25 21.25"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.69 8.5293L10.21 12.0003L13.69 15.4713"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowLeftCircleSharpBrokenIcon;
