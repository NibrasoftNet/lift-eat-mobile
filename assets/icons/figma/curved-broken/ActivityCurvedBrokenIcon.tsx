import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ActivityCurvedBrokenIcon component
 */
export const ActivityCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M6.89746 14.9021L9.89046 11.0131L13.3045 13.6931L16.2335 9.91309" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.11118 21.3166C3.92418 20.5156 2.43018 17.9276 2.43018 12.3516C2.43018 5.41456 4.74318 3.10156 11.6802 3.10156C12.7902 3.10156 13.7812 3.16056 14.6632 3.28856" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M20.7362 9.31738C20.8692 10.2124 20.9302 11.2204 20.9302 12.3514C20.9302 19.2894 18.6182 21.6014 11.6802 21.6014" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M21.5696 4.32044C21.5696 5.38144 20.7096 6.24244 19.6476 6.24244C18.5856 6.24244 17.7256 5.38144 17.7256 4.32044C17.7256 3.25844 18.5856 2.39844 19.6476 2.39844" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ActivityCurvedBrokenIcon;
