import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperPlusSharpBulkIcon component
 */
export const PaperPlusSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M14.5401 8.341V3.681L19.0101 8.341H14.5401ZM15.0301 2.25H4.08008V21.75H20.4201V7.87L15.0301 2.25Z" fill={color} />
    <Path d="M12.2903 15.1761H14.7583V13.6761H12.2903V11.2061H10.7903V13.6761H8.31934V15.1761H10.7903V17.6461H12.2903V15.1761Z" fill={color} />
  </Svg>
);

export default PaperPlusSharpBulkIcon;
