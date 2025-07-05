import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BagSharpBoldIcon component
 */
export const BagSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M17.62 7.51482H16.07C15.57 5.88482 14.05 4.69482 12.25 4.69482C10.45 4.69482 8.92997 5.88482 8.42997 7.51482H6.87997C7.41997 5.04482 9.62997 3.19482 12.25 3.19482C14.87 3.19482 17.08 5.04482 17.62 7.51482Z"
      fill={color}
    />
    <Path
      d="M22.04 7.51482L20.9 21.8748H3.59996L2.45996 7.51482L6.87997 7.51482C6.78997 7.89482 6.74996 8.28482 6.74996 8.69482V10.5548H8.24996V8.69482C8.24996 8.28482 8.30997 7.89482 8.42997 7.51482H16.07C16.19 7.89482 16.25 8.28482 16.25 8.69482V10.5548H17.75V8.69482C17.75 8.28482 17.71 7.89482 17.62 7.51482L22.04 7.51482Z"
      fill={color}
    />
  </Svg>
);

export default BagSharpBoldIcon;
