import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DeleteSharpBulkIcon component
 */
export const DeleteSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M4.33008 7.63672L5.75008 22.4767H18.7501L20.1701 7.63672H4.33008Z"
      fill={color}
    />
    <Path
      d="M16.6065 4.16596H18.1875V5.66596H6.31152V4.16596H7.89252V2.73096H16.6065V4.16596Z"
      fill={color}
    />
    <Path d="M11.4995 18.1371H12.9995V11.9771H11.4995V18.1371Z" fill={color} />
  </Svg>
);

export default DeleteSharpBulkIcon;
