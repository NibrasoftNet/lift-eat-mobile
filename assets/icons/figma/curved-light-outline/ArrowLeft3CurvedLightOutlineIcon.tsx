import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft3CurvedLightOutlineIcon component
 */
export const ArrowLeft3CurvedLightOutlineIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M9.13731 17.0403C9.59031 17.2283 10.0733 17.3943 10.5033 17.3943C10.8123 17.3943 11.0933 17.3093 11.3163 17.0853C11.7799 16.6199 12.0371 14.7613 12.0877 12.7505H20.3045C20.7185 12.7505 21.0545 12.4145 21.0545 12.0005C21.0545 11.5865 20.7185 11.2505 20.3045 11.2505H12.0873C12.0358 9.24395 11.7785 7.39144 11.3153 6.92732C10.7513 6.36432 9.81831 6.65132 9.06531 6.96132C7.49231 7.61232 2.94531 10.3593 2.94531 12.0073C2.94531 13.7083 7.69531 16.4433 9.13731 17.0403ZM10.3153 15.8753C9.01931 15.6353 4.95231 12.9643 4.46631 12.0053C4.95031 11.0093 9.01831 8.31431 10.2913 8.11632C10.7043 9.37031 10.6973 14.6733 10.3153 15.8753Z" fill={color} />
  </Svg>
);

export default ArrowLeft3CurvedLightOutlineIcon;
