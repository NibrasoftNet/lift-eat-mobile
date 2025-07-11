import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HeartSharpLightBorderIcon component
 */
export const HeartSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M21.4999 9.63531C21.49 7.09945 20.1596 4.71464 17.5366 3.86966C15.7355 3.28845 13.7736 3.61167 12.25 5.79914C10.7264 3.61167 8.76447 3.28845 6.96339 3.86966C4.34014 4.71474 3.00971 7.09999 3.00008 9.63618C2.97582 14.6799 8.08662 18.5394 12.2487 20.3842L12.25 20.3836L12.2513 20.3842C16.4136 18.5393 21.5248 14.6794 21.4999 9.63531Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default HeartSharpLightBorderIcon;
