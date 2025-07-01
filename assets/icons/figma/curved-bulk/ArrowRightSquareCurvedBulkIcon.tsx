import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSquareCurvedBulkIcon component
 */
export const ArrowRightSquareCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M12.25 2.25C5.051 2.25 2.5 4.802 2.5 12C2.5 19.198 5.051 21.75 12.25 21.75C19.448 21.75 22 19.198 22 12C22 4.802 19.448 2.25 12.25 2.25Z" fill={color} />
    <Path d="M12.5712 16.4984C12.7152 16.4984 12.8592 16.4574 12.9872 16.3714C14.2202 15.5454 17.0902 13.4664 17.0902 12.0004C17.0902 10.5344 14.2212 8.4524 12.9882 7.6254C12.6412 7.3944 12.1772 7.4864 11.9472 7.8304C11.7162 8.1744 11.8082 8.6414 12.1522 8.8714C13.3192 9.6534 14.4322 10.5824 15.0622 11.2504H8.16016C7.74616 11.2504 7.41016 11.5864 7.41016 12.0004C7.41016 12.4144 7.74616 12.7504 8.16016 12.7504H15.0602C14.4352 13.4184 13.3352 14.3334 12.1532 15.1254C11.8082 15.3554 11.7162 15.8214 11.9472 16.1654C12.0912 16.3824 12.3292 16.4984 12.5712 16.4984Z" fill={color} />
  </Svg>
);

export default ArrowRightSquareCurvedBulkIcon;
