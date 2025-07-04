import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperDownload1SharpBulkIcon component
 */
export const PaperDownload1SharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M14.5401 8.341V3.681L19.0101 8.341H14.5401ZM15.0301 2.25H4.08008V21.75H20.4201V7.87L15.0301 2.25Z" fill={color} />
    <Path d="M7.71387 14.5339L11.1379 17.9729L14.5609 14.5329L13.4979 13.4749L11.8869 15.0939V9.50293H10.3869V15.0929L8.77587 13.4749L7.71387 14.5339Z" fill={color} />
  </Svg>
);

export default PaperDownload1SharpBulkIcon;
