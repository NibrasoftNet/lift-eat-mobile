import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LocationSharpBoldIcon component
 */
export const LocationSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2498 13.4951C10.7408 13.4951 9.51278 12.2681 9.51278 10.7591C9.51278 9.25012 10.7408 8.02212 12.2498 8.02212C13.7588 8.02212 14.9858 9.25012 14.9858 10.7591C14.9858 12.2681 13.7588 13.4951 12.2498 13.4951ZM17.8638 4.65212C16.3328 3.07312 14.3388 2.20312 12.2498 2.20312C10.1588 2.20312 8.16478 3.07313 6.63278 4.65313C5.07778 6.25712 4.22378 8.41212 4.29078 10.5661C4.47978 16.6701 11.6698 21.4231 11.9768 21.6221L12.2458 21.7971L12.5178 21.6251C12.8238 21.4311 20.0188 16.7931 20.2088 10.5651C20.2748 8.41213 19.4198 6.25612 17.8638 4.65212Z"
      fill={color}
    />
  </Svg>
);

export default LocationSharpBoldIcon;
