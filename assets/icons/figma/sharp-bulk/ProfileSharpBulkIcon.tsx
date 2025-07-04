import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ProfileSharpBulkIcon component
 */
export const ProfileSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M19.7693 19.3911C18.7533 16.1781 16.0233 14.3371 12.2763 14.3371H12.2493C8.4923 14.3161 5.7483 16.1701 4.7303 19.3911L4.6123 19.7651L4.9463 19.9691C6.9043 21.1631 9.3463 21.7681 12.2023 21.7681C12.2343 21.7681 12.2663 21.7681 12.2973 21.7681C15.1933 21.7681 17.5673 21.1791 19.5533 19.9691L19.8873 19.7651L19.7693 19.3911Z" fill={color} />
    <Path d="M12.25 12.1089C14.973 12.1089 17.189 9.89393 17.189 7.17093C17.189 4.44693 14.973 2.23193 12.25 2.23193C9.52701 2.23193 7.31201 4.44693 7.31201 7.17093C7.31201 9.89393 9.52701 12.1089 12.25 12.1089Z" fill={color} />
  </Svg>
);

export default ProfileSharpBulkIcon;
