import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Bag2SharpBulkIcon component
 */
export const Bag2SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M2.95996 22.6598L3.90996 7.02979H20.59L21.54 22.6598H2.95996Z"
      fill={color}
    />
    <Path
      d="M10.1497 4.90967C10.7797 4.27967 11.6597 3.90967 12.5497 3.90967H12.5697C14.3497 3.90967 15.7897 5.28967 15.9397 7.02967H17.4397C17.2897 4.45967 15.1697 2.40967 12.5697 2.40967H12.5497C11.2597 2.40967 9.99969 2.92967 9.08969 3.83967C8.23969 4.68967 7.74969 5.83967 7.67969 7.02967H9.17969C9.24969 6.23967 9.57969 5.46967 10.1497 4.90967Z"
      fill={color}
    />
    <Path d="M9.01978 12.3999H10.5598V10.8999H9.01978V12.3999Z" fill={color} />
    <Path d="M14.6298 12.3999H16.1698V10.8999H14.6298V12.3999Z" fill={color} />
  </Svg>
);

export default Bag2SharpBulkIcon;
