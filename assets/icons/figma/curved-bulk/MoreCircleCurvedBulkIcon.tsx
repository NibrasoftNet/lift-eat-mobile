import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreCircleCurvedBulkIcon component
 */
export const MoreCircleCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M12.25 2.78516C5.051 2.78516 2.5 5.33616 2.5 12.5352C2.5 19.7332 5.051 22.2852 12.25 22.2852C19.449 22.2852 22 19.7332 22 12.5352C22 5.33616 19.449 2.78516 12.25 2.78516Z" fill={color} />
    <Path d="M14.4592 14.4355C14.4592 14.9885 14.9112 15.4355 15.4632 15.4355C16.0152 15.4355 16.4632 14.9885 16.4632 14.4355C16.4632 13.8825 16.0152 13.4355 15.4632 13.4355H15.4542C14.9022 13.4355 14.4592 13.8825 14.4592 14.4355Z" fill={color} />
    <Path d="M11.4592 10.4355C11.4592 10.9885 11.9112 11.4355 12.4632 11.4355C13.0152 11.4355 13.4632 10.9885 13.4632 10.4355C13.4632 9.88255 13.0152 9.43555 12.4632 9.43555H12.4542C11.9022 9.43555 11.4592 9.88255 11.4592 10.4355Z" fill={color} />
    <Path d="M8.4502 14.4355C8.4502 14.9885 8.9032 15.4355 9.4552 15.4355C10.0072 15.4355 10.4552 14.9885 10.4552 14.4355C10.4552 13.8825 10.0072 13.4355 9.4552 13.4355H9.4462C8.8942 13.4355 8.4502 13.8825 8.4502 14.4355Z" fill={color} />
  </Svg>
);

export default MoreCircleCurvedBulkIcon;
