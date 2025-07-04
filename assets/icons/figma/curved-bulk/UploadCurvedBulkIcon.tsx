import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UploadCurvedBulkIcon component
 */
export const UploadCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M16.65 7.28802C15.53 7.20802 14.3499 7.1682 13.1199 7.1582H11.6199C10.4099 7.1682 9.15 7.21802 7.85 7.28802H7.83C3.8 7.65802 2.5 9.48802 2.5 14.788C2.5 22.388 5.35 22.388 12.25 22.388C19.15 22.388 22 22.388 22 14.788C22 9.48802 20.7 7.65802 16.65 7.28802Z" fill={color} />
    <Path d="M12.9998 4.16953L14.6388 5.81253C14.7848 5.95953 14.9778 6.03353 15.1698 6.03353C15.3608 6.03353 15.5528 5.95953 15.6988 5.81453C15.9928 5.52153 15.9928 5.04653 15.7008 4.75353L12.7808 1.82553C12.4998 1.54253 11.9998 1.54253 11.7188 1.82553L8.79883 4.75353C8.50683 5.04653 8.50683 5.52153 8.80083 5.81453C9.09483 6.10653 9.56883 6.10653 9.86083 5.81253L11.4998 4.16953V14.4064C11.4998 14.8181 11.8454 15.1486 12.257 15.1486C12.6689 15.1486 12.9998 14.8177 12.9998 14.4058V4.16953Z" fill={color} />
  </Svg>
);

export default UploadCurvedBulkIcon;
