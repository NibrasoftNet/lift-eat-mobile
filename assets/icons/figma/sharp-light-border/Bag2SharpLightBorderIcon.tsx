import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Bag2SharpLightBorderIcon component
 */
export const Bag2SharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M15.42 11.5182H15.376"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.81262 11.5182H9.76862"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.1219 7.39941L21.0105 22.0346L3.49023 22.0346L4.37881 7.39941L20.1219 7.39941Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.7229 7.18864C16.7229 4.89449 14.8632 3.03471 12.569 3.03471C11.4643 3.03002 10.4032 3.4656 9.62034 4.24512C8.83751 5.02465 8.39745 6.08389 8.39746 7.18864"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Bag2SharpLightBorderIcon;
