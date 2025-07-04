import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperUploadSharpBoldIcon component
 */
export const PaperUploadSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M14.5401 8.47967V3.81967L19.0101 8.47967H14.5401ZM14.0151 13.5187H13.2651C12.5991 13.5187 11.9631 13.2997 11.4281 12.9317V18.7777H9.92808V12.9317C9.39408 13.2997 8.75808 13.5187 8.09108 13.5187H7.34108V12.0187H8.09108C9.05208 12.0187 9.92808 11.1427 9.92808 10.1817V9.43167H11.4281V10.1817C11.4281 11.1427 12.3041 12.0187 13.2651 12.0187H14.0151V13.5187ZM15.0301 2.38867H4.08008V21.8887H20.4201V8.00867L15.0301 2.38867Z" fill={color} />
  </Svg>
);

export default PaperUploadSharpBoldIcon;
