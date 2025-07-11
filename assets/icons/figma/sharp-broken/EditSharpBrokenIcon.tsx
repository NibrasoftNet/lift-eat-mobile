import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EditSharpBrokenIcon component
 */
export const EditSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M16.351 3.35645L21.25 8.25645L8.149 21.3564L3.255 21.3524L3.25 16.4574L13.029 6.67845"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.5724 21.3516L11.7314 21.3506"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default EditSharpBrokenIcon;
