import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Bag2SharpBrokenIcon component
 */
export const Bag2SharpBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M15.4204 11.5181H15.3764" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M9.81302 11.5181H9.76902" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.28123 22.0349H3.49023L4.37923 7.3999H20.1222L21.0102 22.0349H11.3772" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.7235 7.18871C16.7235 4.89471 14.8635 3.03471 12.5695 3.03471C11.4645 3.02971 10.4035 3.46571 9.62046 4.24471C8.83846 5.02471 8.39746 6.08371 8.39746 7.18871" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Bag2SharpBrokenIcon;
