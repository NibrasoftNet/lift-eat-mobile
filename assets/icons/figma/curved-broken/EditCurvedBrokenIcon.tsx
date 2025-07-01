import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EditCurvedBrokenIcon component
 */
export const EditCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M13.354 19.3789H19.731" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M5.06708 14.3319C3.32808 16.6499 4.97308 19.5219 4.97308 19.5219C4.97308 19.5219 8.21708 20.2679 9.93108 17.9829C11.6461 15.6989 16.6831 8.98786 16.6831 8.98786C17.6911 7.64486 17.4201 5.73786 16.0771 4.72986C14.7331 3.72186 12.8271 3.99386 11.8191 5.33686C11.8191 5.33686 8.82408 9.32686 6.66008 12.2089" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.5273 8.63965L15.3873 10.7336" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default EditCurvedBrokenIcon;
