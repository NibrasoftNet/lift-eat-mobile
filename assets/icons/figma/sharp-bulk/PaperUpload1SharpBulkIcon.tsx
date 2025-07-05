import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperUpload1SharpBulkIcon component
 */
export const PaperUpload1SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M14.5401 8.341V3.681L19.0101 8.341H14.5401ZM15.0301 2.25H4.08008V21.75H20.4201V7.87L15.0301 2.25Z"
      fill={color}
    />
    <Path
      d="M7.71387 12.9421L11.1379 9.50315L14.5609 12.9431L13.4979 14.0011L11.8869 12.3821V17.9731H10.3869V12.3831L8.77587 14.0011L7.71387 12.9421Z"
      fill={color}
    />
  </Svg>
);

export default PaperUpload1SharpBulkIcon;
