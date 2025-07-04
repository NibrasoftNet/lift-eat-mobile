import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight3RegularBrokenIcon component
 */
export const ArrowRight3RegularBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.7616 7.21725V11.2826H3.73421C3.32893 11.2826 3 11.604 3 11.9999C3 12.3958 3.32893 12.7172 3.73421 12.7172H11.7616V16.7826C11.7616 17.0436 11.9065 17.2846 12.1415 17.4109C12.3754 17.5371 12.6613 17.5285 12.8864 17.3898L20.6564 12.6072C20.8708 12.4752 21 12.2466 21 11.9999C21 11.7532 20.8708 11.5246 20.6564 11.3926L15.8213 8.41746C15.4797 8.20611 15.0255 8.30652 14.8091 8.64124C14.5937 8.97692 14.6965 9.4197 15.0401 9.63105L18.8874 11.9999L13.2301 15.4838V7.21725C13.2301 6.82133 12.9011 6.5 12.4958 6.5C12.0906 6.5 11.7616 6.82133 11.7616 7.21725Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRight3RegularBrokenIcon;
