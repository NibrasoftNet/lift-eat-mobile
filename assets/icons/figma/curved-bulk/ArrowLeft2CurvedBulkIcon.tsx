import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft2CurvedBulkIcon component
 */
export const ArrowLeft2CurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M9.75037 12.0001C9.75037 12.0001 9.75037 12.0001 9.75037 12.0001C9.75037 13.5601 13.6344 16.5851 16.2594 18.1401C16.7334 18.4201 16.8934 19.0331 16.6104 19.5091C16.3294 19.9841 15.7164 20.1421 15.2414 19.8601C13.9904 19.1211 7.75037 15.2661 7.75037 12.0001C7.75037 12.0001 7.75037 12.0001 7.75037 12.0001L9.75037 12.0001Z" fill={color} />
    <Path d="M7.74943 12C7.74943 8.73389 13.9892 4.87891 15.2402 4.14014C15.4799 3.99805 15.7543 3.96777 16.0033 4.0332C16.2489 4.09766 16.4701 4.25537 16.6093 4.49121C16.8925 4.96387 16.7323 5.5791 16.2582 5.85986C13.6332 7.41309 9.74943 10.438 9.74943 12L7.74943 12Z" fill={color} />
  </Svg>
);

export default ArrowLeft2CurvedBulkIcon;
