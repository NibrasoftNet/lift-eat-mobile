import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownCircleSharpLightBorderIcon component
 */
export const ArrowDownCircleSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M3 12C3 17.108 7.141 21.25 12.25 21.25C17.358 21.25 21.5 17.108 21.5 12C21.5 6.892 17.358 2.75 12.25 2.75C7.141 2.75 3 6.892 3 12Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.77881 10.5576L12.2498 14.0436L15.7208 10.5576"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowDownCircleSharpLightBorderIcon;
