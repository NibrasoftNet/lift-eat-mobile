import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DangerTriangleSharpBulkIcon component
 */
export const DangerTriangleSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M12.6132 3.74414H11.8842L2.40625 20.3731L3.06225 21.3251H21.3803L22.0933 20.3871L12.6132 3.74414Z" fill={color} />
    <Path d="M11.5158 18.088H13.0158V16.588H11.5068L11.5158 18.088Z" fill={color} />
    <Path d="M13.0138 15.301H11.5138V11H13.0138V15.301Z" fill={color} />
  </Svg>
);

export default DangerTriangleSharpBulkIcon;
