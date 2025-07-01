import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UploadCurvedBrokenIcon component
 */
export const UploadCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12.1196 12.2725V14.2755" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.1196 2.23438V9.23938" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M11.9995 21.766C18.9395 21.766 21.2495 21.766 21.2495 14.665C21.2495 9.33504 19.9495 7.99504 16.3695 7.66504" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.63 7.66504C4.05 7.99504 2.75 9.33504 2.75 14.665C2.75 20.189 4.148 21.416 8.036 21.688" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M9.19971 5.1614L12.1197 2.2334L15.0397 5.1614" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default UploadCurvedBrokenIcon;
