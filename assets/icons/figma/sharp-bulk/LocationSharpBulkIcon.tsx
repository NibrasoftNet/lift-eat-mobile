import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LocationSharpBulkIcon component
 */
export const LocationSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M17.8638 4.65212C16.3328 3.07312 14.3388 2.20312 12.2498 2.20312C10.1588 2.20312 8.16478 3.07313 6.63278 4.65313C5.07778 6.25712 4.22378 8.41212 4.29078 10.5661C4.47978 16.6701 11.6698 21.4231 11.9768 21.6221L12.2458 21.7971L12.5178 21.6251C12.8238 21.4311 20.0188 16.7931 20.2088 10.5651C20.2748 8.41213 19.4198 6.25612 17.8638 4.65212Z" fill={color} />
    <Path d="M9.5127 10.759C9.5127 12.268 10.7407 13.495 12.2497 13.495C13.7587 13.495 14.9857 12.268 14.9857 10.759C14.9857 9.24997 13.7587 8.02197 12.2497 8.02197C10.7407 8.02197 9.5127 9.24997 9.5127 10.759Z" fill={color} />
  </Svg>
);

export default LocationSharpBulkIcon;
