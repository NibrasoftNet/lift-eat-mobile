import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SettingCurvedBrokenIcon component
 */
export const SettingCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11.9995 9.5C13.3805 9.5 14.4995 10.619 14.4995 12C14.4995 13.381 13.3805 14.5 11.9995 14.5C10.6185 14.5 9.49951 13.381 9.49951 12" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.21183 6.33888C6.02783 5.64988 4.51483 6.05788 3.83183 7.24988C3.14883 8.44288 3.55383 9.96688 4.73783 10.6539C5.76483 11.2529 5.76483 12.7469 4.73783 13.3459C3.55383 14.0339 3.14883 15.5589 3.83183 16.7499C4.51483 17.9419 6.02783 18.3499 7.21083 17.6629H7.21183C8.23983 17.0639 9.52483 17.8119 9.52483 19.0079C9.52483 20.3839 10.6338 21.4999 11.9998 21.4999C13.3658 21.4999 14.4738 20.3839 14.4738 19.0079C14.4738 17.8119 15.7598 17.0639 16.7888 17.6629" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M20.1674 16.75C20.8514 15.559 20.4454 14.034 19.2624 13.346H19.2614C18.2334 12.747 18.2334 11.253 19.2624 10.654C20.4454 9.967 20.8514 8.443 20.1674 7.25C19.4834 6.058 17.9704 5.65 16.7884 6.339C15.7594 6.936 14.4734 6.189 14.4734 4.992C14.4734 3.616 13.3654 2.5 11.9994 2.5C10.6334 2.5 9.52441 3.616 9.52441 4.992" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default SettingCurvedBrokenIcon;
