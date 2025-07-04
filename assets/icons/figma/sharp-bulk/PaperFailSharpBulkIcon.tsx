import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperFailSharpBulkIcon component
 */
export const PaperFailSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M14.5401 8.341V3.681L19.0101 8.341H14.5401ZM15.0301 2.25H4.08008V21.75H20.4201V7.87L15.0301 2.25Z" fill={color} />
    <Path d="M13.3113 16.908L14.3723 15.847L12.6253 14.101L14.3733 12.353L13.3133 11.293L11.5653 13.041L9.81735 11.293L8.75635 12.353L10.5043 14.101L8.75835 15.847L9.81935 16.908L11.5653 15.162L13.3113 16.908Z" fill={color} />
  </Svg>
);

export default PaperFailSharpBulkIcon;
