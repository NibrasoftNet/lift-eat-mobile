import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EditSquareSharpBoldIcon component
 */
export const EditSquareSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M16.2525 12.002L12.7825 8.532L14.9485 6.366L18.4185 9.836L16.2525 12.002ZM5.67353 19.111L5.67053 15.645L11.7225 9.593L15.1915 13.063L9.13953 19.115L5.67353 19.111ZM2.51953 22.354H21.9805V2.854H2.51953V22.354Z" fill={color} />
  </Svg>
);

export default EditSquareSharpBoldIcon;
