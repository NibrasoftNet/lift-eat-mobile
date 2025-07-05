import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft2SharpBoldIcon component
 */
export const ArrowLeft2SharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M15.7499 20.4139L7.33594 11.9999L15.7499 3.58594L17.1639 4.99994L10.1639 11.9999L17.1639 18.9999L15.7499 20.4139Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeft2SharpBoldIcon;
