import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CategorySharpBulkIcon component
 */
export const CategorySharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path d="M2.30078 10.9507H10.3008V2.95068H2.30078V10.9507Z" fill={color} />
    <Path d="M2.30078 21.9497H10.3008V13.9497H2.30078V21.9497Z" fill={color} />
    <Path d="M13.3008 21.9497H21.3008V13.9497H13.3008V21.9497Z" fill={color} />
    <Path
      d="M22.1999 4.12178L14.4719 2.05078L12.4019 9.77878L20.1289 11.8488L22.1999 4.12178Z"
      fill={color}
    />
  </Svg>
);

export default CategorySharpBulkIcon;
