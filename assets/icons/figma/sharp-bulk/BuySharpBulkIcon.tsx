import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BuySharpBulkIcon component
 */
export const BuySharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M6.39531 6.3017L6.09531 3.2417H2.19531V4.7417H4.73531L6.01531 17.4417H20.8353L22.3053 6.3017H6.39531Z"
      fill={color}
    />
    <Path d="M13.8247 11.7119H17.9947V10.2119H13.8247V11.7119Z" fill={color} />
    <Path
      d="M6.58008 20.5528C6.58008 19.8498 7.15108 19.2788 7.85408 19.2788C8.55608 19.2788 9.12708 19.8498 9.12708 20.5528C9.12708 21.2558 8.55608 21.8278 7.85408 21.8278C7.15108 21.8278 6.58008 21.2558 6.58008 20.5528Z"
      fill={color}
    />
    <Path
      d="M17.4473 20.5528C17.4473 19.8498 18.0183 19.2788 18.7213 19.2788C19.4243 19.2788 19.9953 19.8498 19.9953 20.5528C19.9953 21.2558 19.4243 21.8278 18.7213 21.8278C18.0183 21.8278 17.4473 21.2558 17.4473 20.5528Z"
      fill={color}
    />
  </Svg>
);

export default BuySharpBulkIcon;
