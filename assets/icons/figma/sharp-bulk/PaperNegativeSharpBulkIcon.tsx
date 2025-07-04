import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperNegativeSharpBulkIcon component
 */
export const PaperNegativeSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M14.5401 8.341V3.681L19.0101 8.341H14.5401ZM15.0301 2.25H4.08008V21.75H20.4201V7.87L15.0301 2.25Z" fill={color} />
    <Path d="M14.938 15.1758H8.49805V13.6758H14.938V15.1758Z" fill={color} />
  </Svg>
);

export default PaperNegativeSharpBulkIcon;
