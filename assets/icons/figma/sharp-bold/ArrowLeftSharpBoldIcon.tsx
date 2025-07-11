import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSharpBoldIcon component
 */
export const ArrowLeftSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M20.9585 10.9995H7.3805L12.4225 5.97852L11.0115 4.56152L3.5415 12.0005L11.0115 19.4385L12.4225 18.0215L7.3785 12.9995H20.9585V10.9995Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeftSharpBoldIcon;
