import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallingSharpLightBorderIcon component
 */
export const CallingSharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M14.4971 3.354C18.1981 3.765 21.1221 6.685 21.5371 10.386" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.4971 6.89697C16.2681 7.24097 17.6521 8.62597 17.9971 10.397" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M18.0657 21.8417C8.9165 22.2605 2.10318 11.8871 3.04979 6.82576C3.91833 5.33331 5.0316 4.22792 6.52155 3.354L9.76207 7.80524L8.11867 10.6593C8.11867 10.6593 8.57246 12.5647 10.2804 14.2726C12.073 16.0652 14.0727 16.6133 14.0727 16.6133L16.9268 14.9699L21.5375 18.3699C20.6797 19.9025 19.5983 20.9839 18.0657 21.8417Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default CallingSharpLightBorderIcon;
