import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DownloadCurvedBulkIcon component
 */
export const DownloadCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M16.65 7.28704C15.53 7.20704 14.3499 7.16723 13.1199 7.15723H11.6199C10.4099 7.16723 9.15 7.21704 7.85 7.28704H7.83C3.8 7.65704 2.5 9.48704 2.5 14.787C2.5 22.387 5.35 22.387 12.25 22.387C19.15 22.387 22 22.387 22 14.787C22 9.48704 20.7 7.65704 16.65 7.28704Z" fill={color} />
    <Path d="M12.9998 12.5912L14.6388 10.9482C14.7848 10.8012 14.9778 10.7272 15.1698 10.7272C15.3608 10.7272 15.5528 10.8012 15.6988 10.9462C15.9928 11.2392 15.9928 11.7142 15.7008 12.0072L12.7808 14.9352C12.4998 15.2182 11.9998 15.2182 11.7188 14.9352L8.79883 12.0072C8.50683 11.7142 8.50683 11.2392 8.80083 10.9462C9.09483 10.6542 9.56883 10.6542 9.86083 10.9482L11.4998 12.5912V2.35435C11.4998 1.94267 11.8454 1.61209 12.257 1.6121C12.6689 1.6121 12.9998 1.94304 12.9998 2.35495V12.5912Z" fill={color} />
  </Svg>
);

export default DownloadCurvedBulkIcon;
