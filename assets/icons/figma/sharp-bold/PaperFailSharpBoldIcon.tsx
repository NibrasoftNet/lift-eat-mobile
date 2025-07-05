import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperFailSharpBoldIcon component
 */
export const PaperFailSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M14.5401 8.341V3.681L19.0101 8.341H14.5401ZM14.3721 15.847L13.3111 16.908L11.5651 15.162L9.81908 16.908L8.75808 15.847L10.5041 14.101L8.75608 12.353L9.81708 11.293L11.5651 13.041L13.3131 11.293L14.3731 12.353L12.6251 14.101L14.3721 15.847ZM15.0301 2.25H4.08008V21.75H20.4201V7.87L15.0301 2.25Z"
      fill={color}
    />
  </Svg>
);

export default PaperFailSharpBoldIcon;
