import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LocationRegularTwotoneIcon component
 */
export const LocationRegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M4.23926 10.3912C4.25367 6.15065 7.70302 2.72465 11.9436 2.73906C16.1842 2.75347 19.6102 6.20282 19.5958 10.4434V10.5304C19.5436 13.2869 18.0045 15.8347 16.1175 17.826C15.0384 18.9466 13.8333 19.9387 12.5262 20.7825C12.1767 21.0848 11.6583 21.0848 11.3088 20.7825C9.36033 19.5143 7.65019 17.9131 6.25665 16.0521C5.01461 14.4293 4.30942 12.4597 4.23926 10.4173L4.23926 10.3912Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Circle cx="11.9174" cy="10.539" r="2.46087" fill={none} stroke={color} />
  </Svg>
);

export default LocationRegularTwotoneIcon;
