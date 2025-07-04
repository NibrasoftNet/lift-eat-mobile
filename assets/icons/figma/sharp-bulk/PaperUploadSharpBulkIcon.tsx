import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperUploadSharpBulkIcon component
 */
export const PaperUploadSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M14.5401 8.47967V3.81967L19.0101 8.47967H14.5401ZM15.0301 2.38867H4.08008V21.8887H20.4201V8.00867L15.0301 2.38867Z"
      fill={color}
    />
    <Path
      d="M13.2653 13.5186H14.0153V12.0186H13.2653C12.3043 12.0186 11.4283 11.1426 11.4283 10.1816V9.43164H9.92831V10.1816C9.92831 11.1426 9.05231 12.0186 8.09131 12.0186H7.34131V13.5186H8.09131C8.75831 13.5186 9.39431 13.2996 9.92831 12.9316V18.7776H11.4283V12.9316C11.9633 13.2996 12.5993 13.5186 13.2653 13.5186Z"
      fill={color}
    />
  </Svg>
);

export default PaperUploadSharpBulkIcon;
