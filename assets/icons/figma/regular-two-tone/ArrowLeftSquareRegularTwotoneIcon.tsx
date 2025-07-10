import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSquareRegularTwotoneIcon component
 */
export const ArrowLeftSquareRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2.75 7.666L2.75 16.335C2.75 19.355 4.889 21.25 7.916 21.25L16.084 21.25C19.111 21.25 21.25 19.365 21.25 16.335L21.25 7.666C21.25 4.636 19.111 2.75 16.084 2.75L7.916 2.75C4.889 2.75 2.75 4.636 2.75 7.666Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.91394 12L16.0859 12"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.6777 15.748L7.91373 12L11.6777 8.25195"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowLeftSquareRegularTwotoneIcon;
