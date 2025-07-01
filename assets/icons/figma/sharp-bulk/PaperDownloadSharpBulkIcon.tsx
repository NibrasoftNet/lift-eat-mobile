import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperDownloadSharpBulkIcon component
 */
export const PaperDownloadSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M14.5401 8.47967V3.81967L19.0101 8.47967H14.5401ZM15.0301 2.38867H4.08008V21.8887H20.4201V8.00867L15.0301 2.38867Z" fill={color} />
    <Path d="M13.2653 16.1906H14.0153V14.6906H13.2653C12.5983 14.6906 11.9633 14.9106 11.4283 15.2776V9.43164H9.92831V15.2776C9.39431 14.9106 8.75831 14.6906 8.09131 14.6906H7.34131V16.1906H8.09131C9.05231 16.1906 9.92831 17.0666 9.92831 18.0276V18.7776H11.4283V18.0276C11.4283 17.0666 12.3043 16.1906 13.2653 16.1906Z" fill={color} />
  </Svg>
);

export default PaperDownloadSharpBulkIcon;
