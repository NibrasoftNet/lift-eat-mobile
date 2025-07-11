import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown2RegularBrokenIcon component
 */
export const ArrowDown2RegularBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M4.24169 7.744C4.56321 7.41941 5.08445 7.41718 5.40597 7.74623L12.5826 15.0723C12.9041 15.4002 12.903 15.93 12.5804 16.2557C12.4202 16.4175 12.2095 16.5 11.9999 16.5C11.7881 16.5 11.5774 16.4175 11.4172 16.2535L4.24059 8.92745C3.91907 8.59952 3.92017 8.0697 4.24169 7.744ZM18.5929 7.74634C18.9145 7.41729 19.4357 7.41952 19.7572 7.74411C20.0798 8.06981 20.0809 8.59963 19.7605 8.92756L14.9948 13.793C14.8345 13.957 14.6228 14.0395 14.4121 14.0395C14.2025 14.0395 13.9918 13.957 13.8316 13.7952C13.509 13.4695 13.5079 12.9397 13.8283 12.6118L18.5929 7.74634Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDown2RegularBrokenIcon;
