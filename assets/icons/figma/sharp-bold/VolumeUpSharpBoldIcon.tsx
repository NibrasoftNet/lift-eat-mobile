import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeUpSharpBoldIcon component
 */
export const VolumeUpSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M19.9177 4.94712L19.4897 4.33112L18.2577 5.18712L18.6857 5.80212C21.3027 9.57112 21.3027 14.4361 18.6857 18.1971L18.2577 18.8121L19.4887 19.6691L19.9177 19.0531C22.8497 14.8391 22.8497 9.17012 19.9177 4.94712Z" fill={color} />
    <Path d="M17.2312 7.62242L16.8582 6.97142L15.5572 7.71642L15.9292 8.36742C17.2142 10.6124 17.2142 13.3964 15.9302 15.6334L15.5562 16.2834L16.8572 17.0304L17.2312 16.3804C18.7792 13.6834 18.7792 10.3274 17.2312 7.62242Z" fill={color} />
    <Path d="M7.0788 7.56382H2.3848V8.06382C2.3828 10.6878 2.3828 13.3118 2.3848 15.9368V16.4358H7.0788L11.2048 20.0128H12.6678V3.98682H11.2048L7.0788 7.56382Z" fill={color} />
  </Svg>
);

export default VolumeUpSharpBoldIcon;
