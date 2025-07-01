import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EditSquareSharpBulkIcon component
 */
export const EditSquareSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M2.51953 22.354H21.9805V2.854H2.51953V22.354Z" fill={color} />
    <Path d="M12.7819 8.53221L16.2519 12.0022L18.4179 9.83621L14.9479 6.36621L12.7819 8.53221Z" fill={color} />
    <Path d="M5.66992 15.6452L5.67292 19.1112L9.13892 19.1152L15.1909 13.0632L11.7219 9.59321L5.66992 15.6452Z" fill={color} />
  </Svg>
);

export default EditSquareSharpBulkIcon;
