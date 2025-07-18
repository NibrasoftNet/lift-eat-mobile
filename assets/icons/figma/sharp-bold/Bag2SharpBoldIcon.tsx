import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Bag2SharpBoldIcon component
 */
export const Bag2SharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M14.63 12.3997H16.17V10.8997H14.63V12.3997ZM9.01996 12.3997H10.56V10.8997H9.01996V12.3997ZM10.15 4.90967C10.78 4.27967 11.66 3.90967 12.55 3.90967H12.57C14.35 3.90967 15.79 5.28967 15.94 7.02967H9.17996C9.24996 6.23967 9.57996 5.46967 10.15 4.90967ZM20.59 7.02967H17.44C17.29 4.45967 15.17 2.40967 12.57 2.40967H12.55C11.26 2.40967 9.99996 2.92967 9.08996 3.83967C8.23996 4.68967 7.74996 5.83967 7.67996 7.02967H3.90996L2.95996 22.6597H21.54L20.59 7.02967Z"
      fill={color}
    />
  </Svg>
);

export default Bag2SharpBoldIcon;
