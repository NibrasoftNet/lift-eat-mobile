import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ProfileRegularBulkIcon component
 */
export const ProfileRegularBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11.997 15.1747C7.684 15.1747 4 15.8547 4 18.5747C4 21.2957 7.661 21.9997 11.997 21.9997C16.31 21.9997 19.994 21.3207 19.994 18.5997C19.994 15.8787 16.334 15.1747 11.997 15.1747Z" fill={color} />
    <Path d="M11.9971 12.5838C14.9351 12.5838 17.2891 10.2288 17.2891 7.29176C17.2891 4.35476 14.9351 1.99976 11.9971 1.99976C9.06008 1.99976 6.70508 4.35476 6.70508 7.29176C6.70508 10.2288 9.06008 12.5838 11.9971 12.5838Z" fill={color} />
  </Svg>
);

export default ProfileRegularBulkIcon;
