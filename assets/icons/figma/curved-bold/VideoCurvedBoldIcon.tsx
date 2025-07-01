import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VideoCurvedBoldIcon component
 */
export const VideoCurvedBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M22.1514 7.46986C21.3714 6.62986 18.9714 8.13986 17.6114 9.09986C17.8414 10.0899 17.9514 11.2399 17.9514 12.5399C17.9514 13.8299 17.8414 14.9599 17.6214 15.9499C18.7114 16.7199 20.4914 17.8499 21.5314 17.8499C21.7914 17.8499 22.0114 17.7799 22.1514 17.6199C23.0814 16.6299 23.0814 8.46986 22.1514 7.46986Z" fill={color} />
    <Path d="M9.06137 5.10986C3.59137 5.10986 1.65137 7.05986 1.65137 12.5399C1.65137 18.0199 3.59137 19.9599 9.06137 19.9599C14.5214 19.9599 16.4514 18.0199 16.4514 12.5399C16.4514 7.05986 14.5214 5.10986 9.06137 5.10986Z" fill={color} />
  </Svg>
);

export default VideoCurvedBoldIcon;
