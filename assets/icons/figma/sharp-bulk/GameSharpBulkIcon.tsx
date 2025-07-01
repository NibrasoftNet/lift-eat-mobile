import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GameSharpBulkIcon component
 */
export const GameSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M13.0003 7.32764H16.0123C20.1023 7.32764 23.4283 10.6546 23.4283 14.7436C23.4283 18.8326 20.1023 22.1596 16.0123 22.1596H8.48729C4.39729 22.1596 1.07129 18.8326 1.07129 14.7436C1.07129 10.6546 4.39729 7.32764 8.48729 7.32764H11.5003H13.0003Z" fill={color} />
    <Path d="M13.0004 7.32767V6.97967C12.9934 5.46067 11.7344 4.22067 10.1904 4.21567H9.16137C8.84037 4.21567 8.57837 3.96567 8.57837 3.65967V2.90967H7.07837V3.65967C7.07837 4.79267 8.01337 5.71567 9.16137 5.71567H10.1874C10.9084 5.71767 11.4974 6.28867 11.5004 6.98367V7.32767H13.0004Z" fill={color} />
    <Path d="M11.5023 15.4656H9.64227V17.2886H8.14227V15.4656H6.28027V13.9656H8.14227V12.1416H9.64227V13.9656H11.5023V15.4656Z" fill={color} />
    <Path d="M15.9903 13.7516H14.3863V12.2516H15.9903V13.7516Z" fill={color} />
    <Path d="M17.7563 17.2336H16.1523V15.7336H17.7563V17.2336Z" fill={color} />
  </Svg>
);

export default GameSharpBulkIcon;
