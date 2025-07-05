import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HeartSharpTwoToneIcon component
 */
export const HeartSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M21.4999 9.63574C21.5248 14.6799 16.4136 18.5398 12.2513 20.3846L12.25 20.384L12.2487 20.3846C8.08663 18.5399 2.97582 14.6803 3.00009 9.63661"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.4998 9.63531C21.4899 7.09945 20.1595 4.71464 17.5365 3.86966C15.7354 3.28845 13.7736 3.61167 12.2499 5.79914C10.7263 3.61167 8.76439 3.28845 6.96331 3.86966C4.34006 4.71474 3.00962 7.09999 3 9.63618"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default HeartSharpTwoToneIcon;
