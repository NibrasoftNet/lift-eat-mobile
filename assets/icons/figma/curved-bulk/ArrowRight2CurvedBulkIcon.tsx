import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight2CurvedBulkIcon component
 */
export const ArrowRight2CurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M14.7501 12.0001C14.7501 12.0001 14.7501 12.0001 14.7501 12.0001C14.7501 13.5601 10.8661 16.5851 8.24112 18.1401C7.76712 18.4201 7.60712 19.0331 7.89012 19.5091C8.17112 19.9841 8.78412 20.1421 9.25912 19.8601C10.5101 19.1211 16.7501 15.2661 16.7501 12.0001C16.7501 12.0001 16.7501 12.0001 16.7501 12.0001L14.7501 12.0001Z" fill={color} />
    <Path d="M16.7501 12C16.7501 8.73389 10.5103 4.87891 9.25936 4.14014C9.01961 3.99805 8.7452 3.96777 8.49617 4.0332C8.25057 4.09766 8.02938 4.25537 7.89022 4.49121C7.60701 4.96387 7.76717 5.5791 8.24129 5.85986C10.8663 7.41309 14.7501 10.438 14.7501 12L16.7501 12Z" fill={color} />
  </Svg>
);

export default ArrowRight2CurvedBulkIcon;
