import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ProfileCurvedBrokenIcon component
 */
export const ProfileCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11.9997 21.8292C8.18573 21.8292 4.92773 21.2522 4.92773 18.9422C4.92773 16.6322 8.16473 14.5312 11.9997 14.5312C15.8137 14.5312 19.0717 16.6122 19.0717 18.9212C19.0717 20.5472 17.4657 21.3252 15.1767 21.6432" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.9993 2.1709C9.49634 2.1709 7.46634 4.1999 7.46634 6.7039C7.45734 9.1979 9.47334 11.2279 11.9673 11.2369H11.9993C14.5023 11.2369 16.5323 9.2069 16.5323 6.7039C16.5323 5.2059 15.8063 3.8779 14.6863 3.0529" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ProfileCurvedBrokenIcon;
