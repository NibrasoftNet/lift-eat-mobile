import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperDownload1SharpBoldIcon component
 */
export const PaperDownload1SharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M14.5401 8.341V3.681L19.0101 8.341H14.5401ZM11.1381 17.973L7.71408 14.534L8.77608 13.475L10.3871 15.093V9.503H11.8871V15.094L13.4981 13.475L14.5611 14.533L11.1381 17.973ZM15.0301 2.25H4.08008V21.75H20.4201V7.87L15.0301 2.25Z"
      fill={color}
    />
  </Svg>
);

export default PaperDownload1SharpBoldIcon;
