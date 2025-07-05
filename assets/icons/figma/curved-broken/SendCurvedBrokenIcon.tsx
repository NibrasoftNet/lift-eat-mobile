import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SendCurvedBrokenIcon component
 */
export const SendCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M18.2871 15.8416C17.6311 17.7086 16.9641 19.3216 16.4071 20.2866C14.0051 24.4486 11.5271 12.4726 11.5271 12.4726C11.5271 12.4726 -0.44892 9.99459 3.71308 7.59159C7.22508 5.56459 19.3291 2.07959 21.0201 2.97959C21.5131 3.90659 20.6901 7.95859 19.5111 12.0116"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.5273 12.4724L17.5573 6.44238"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default SendCurvedBrokenIcon;
