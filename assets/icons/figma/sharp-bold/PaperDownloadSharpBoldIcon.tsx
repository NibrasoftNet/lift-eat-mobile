import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperDownloadSharpBoldIcon component
 */
export const PaperDownloadSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M14.5401 8.47967V3.81967L19.0101 8.47967H14.5401ZM14.0151 16.1907H13.2651C12.3041 16.1907 11.4281 17.0667 11.4281 18.0277V18.7777H9.92808V18.0277C9.92808 17.0667 9.05208 16.1907 8.09108 16.1907H7.34108V14.6907H8.09108C8.75808 14.6907 9.39408 14.9107 9.92808 15.2777V9.43167H11.4281V15.2777C11.9631 14.9107 12.5981 14.6907 13.2651 14.6907H14.0151V16.1907ZM15.0301 2.38867H4.08008V21.8887H20.4201V8.00867L15.0301 2.38867Z"
      fill={color}
    />
  </Svg>
);

export default PaperDownloadSharpBoldIcon;
