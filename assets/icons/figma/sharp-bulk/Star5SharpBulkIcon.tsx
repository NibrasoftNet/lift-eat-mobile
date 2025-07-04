import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star5SharpBulkIcon component
 */
export const Star5SharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M12.2502 2.1709L9.80716 9.6789H1.91016L8.30216 14.3199L5.86016 21.8289L12.2502 17.1879V2.1709Z" fill={color} />
    <Path d="M12.2498 2.1709L14.6928 9.6789H22.5898L16.1978 14.3199L18.6398 21.8289L12.2498 17.1879V2.1709Z" fill={color} />
  </Svg>
);

export default Star5SharpBulkIcon;
