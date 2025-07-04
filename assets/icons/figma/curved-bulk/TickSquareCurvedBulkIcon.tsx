import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TickSquareCurvedBulkIcon component
 */
export const TickSquareCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M12.25 2.78516C5.052 2.78516 2.5 5.33716 2.5 12.5352C2.5 19.7332 5.052 22.2852 12.25 22.2852C19.448 22.2852 22 19.7332 22 12.5352C22 5.33716 19.448 2.78516 12.25 2.78516Z" fill={color} />
    <Path d="M11.5912 15.4385L16.3412 10.6925C16.6342 10.3995 16.6342 9.92448 16.3412 9.63148C16.0482 9.33948 15.5732 9.33848 15.2802 9.63148L11.0612 13.8475L9.2202 12.0045C8.9282 11.7135 8.4532 11.7115 8.1592 12.0045C7.8662 12.2975 7.8662 12.7725 8.1592 13.0655L10.5302 15.4385C10.6712 15.5795 10.8622 15.6585 11.0612 15.6585C11.2602 15.6585 11.4502 15.5795 11.5912 15.4385Z" fill={color} />
  </Svg>
);

export default TickSquareCurvedBulkIcon;
