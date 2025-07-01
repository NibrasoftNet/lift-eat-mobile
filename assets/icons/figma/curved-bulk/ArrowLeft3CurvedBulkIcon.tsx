import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft3CurvedBulkIcon component
 */
export const ArrowLeft3CurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M11.4383 6.91169C11.9743 7.44669 12.1593 9.25869 12.2093 11.0037L12.2153 13.0037C12.1623 15.2407 11.9023 16.6107 11.4383 17.0747C10.8743 17.6377 9.93433 17.3487 9.17833 17.0347C7.60933 16.3837 3.07333 13.6377 3.07333 11.9927C3.07333 10.2977 7.81133 7.56069 9.25033 6.96369C10.0323 6.63869 10.9033 6.37869 11.4383 6.91169Z" fill={color} />
    <Path d="M12.2093 11.0039L20.4263 11.0039C20.9793 11.0039 21.4263 11.4509 21.4263 12.0039C21.4263 12.5569 20.9793 13.0039 20.4263 13.0039L12.2153 13.0039L12.2093 11.0039Z" fill={color} />
  </Svg>
);

export default ArrowLeft3CurvedBulkIcon;
