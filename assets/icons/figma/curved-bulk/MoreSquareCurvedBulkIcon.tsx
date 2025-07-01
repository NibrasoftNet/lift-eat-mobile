import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreSquareCurvedBulkIcon component
 */
export const MoreSquareCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M12.25 2.78516C5.051 2.78516 2.5 5.33716 2.5 12.5352C2.5 19.7332 5.051 22.2852 12.25 22.2852C19.449 22.2852 22 19.7332 22 12.5352C22 5.33716 19.449 2.78516 12.25 2.78516Z" fill={color} />
    <Path d="M15.249 12.5352C15.249 13.0882 15.701 13.5352 16.253 13.5352C16.805 13.5352 17.253 13.0882 17.253 12.5352C17.253 11.9822 16.805 11.5352 16.253 11.5352H16.244C15.692 11.5352 15.249 11.9822 15.249 12.5352Z" fill={color} />
    <Path d="M11.25 12.5352C11.25 13.0882 11.702 13.5352 12.254 13.5352C12.806 13.5352 13.254 13.0882 13.254 12.5352C13.254 11.9822 12.806 11.5352 12.254 11.5352H12.245C11.693 11.5352 11.25 11.9822 11.25 12.5352Z" fill={color} />
    <Path d="M7.25 12.5352C7.25 13.0882 7.702 13.5352 8.254 13.5352C8.806 13.5352 9.254 13.0882 9.254 12.5352C9.254 11.9822 8.806 11.5352 8.254 11.5352H8.245C7.693 11.5352 7.25 11.9822 7.25 12.5352Z" fill={color} />
  </Svg>
);

export default MoreSquareCurvedBulkIcon;
