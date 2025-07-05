import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperUpload1SharpBoldIcon component
 */
export const PaperUpload1SharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M14.5401 8.341V3.681L19.0101 8.341H14.5401ZM13.5001 13.687L11.8871 12.068V17.66H10.3871V12.07L8.77608 13.687L7.71408 12.629L11.1381 9.19L14.5621 12.629L13.5001 13.687ZM15.0301 2.25H4.08008V21.75H20.4201V7.87L15.0301 2.25Z"
      fill={color}
    />
  </Svg>
);

export default PaperUpload1SharpBoldIcon;
