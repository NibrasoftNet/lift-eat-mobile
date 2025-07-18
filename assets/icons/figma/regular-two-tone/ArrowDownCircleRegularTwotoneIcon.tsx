import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownCircleRegularTwotoneIcon component
 */
export const ArrowDownCircleRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2.75 12C2.75 17.108 6.891 21.25 12 21.25C17.108 21.25 21.25 17.108 21.25 12C21.25 6.892 17.108 2.75 12 2.75C6.891 2.75 2.75 6.892 2.75 12Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.52881 10.5576L11.9998 14.0436L15.4708 10.5576"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowDownCircleRegularTwotoneIcon;
