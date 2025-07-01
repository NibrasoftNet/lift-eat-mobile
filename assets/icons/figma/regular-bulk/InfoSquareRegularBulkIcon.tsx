import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * InfoSquareRegularBulkIcon component
 */
export const InfoSquareRegularBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M16.34 1.99976H7.67C4.28 1.99976 2 4.37976 2 7.91976V16.0898C2 19.6198 4.28 21.9998 7.67 21.9998H16.34C19.73 21.9998 22 19.6198 22 16.0898V7.91976C22 4.37976 19.73 1.99976 16.34 1.99976Z" fill={color} />
    <Path d="M11.1246 8.18933C11.1246 8.67133 11.5156 9.06433 11.9946 9.06433C12.4876 9.06433 12.8796 8.67133 12.8796 8.18933C12.8796 7.70733 12.4876 7.31433 12.0046 7.31433C11.5196 7.31433 11.1246 7.70733 11.1246 8.18933ZM12.8696 11.3621C12.8696 10.8801 12.4766 10.4871 11.9946 10.4871C11.5126 10.4871 11.1196 10.8801 11.1196 11.3621V15.7821C11.1196 16.2641 11.5126 16.6571 11.9946 16.6571C12.4766 16.6571 12.8696 16.2641 12.8696 15.7821V11.3621Z" fill={color} />
  </Svg>
);

export default InfoSquareRegularBulkIcon;
