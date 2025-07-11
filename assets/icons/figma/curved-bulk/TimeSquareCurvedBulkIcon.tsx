import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeSquareCurvedBulkIcon component
 */
export const TimeSquareCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 2.25C5.051 2.25 2.5 4.801 2.5 12C2.5 19.198 5.051 21.75 12.25 21.75C19.449 21.75 22 19.198 22 12C22 4.801 19.449 2.25 12.25 2.25Z"
      fill={color}
    />
    <Path
      d="M15.639 14.7668C15.895 14.7668 16.144 14.6358 16.284 14.4008C16.496 14.0458 16.38 13.5858 16.024 13.3728L12.999 11.5688V7.63281C12.999 7.21881 12.663 6.88281 12.249 6.88281C11.835 6.88281 11.499 7.21881 11.499 7.63281V11.9948C11.499 12.2578 11.638 12.5038 11.865 12.6388L15.256 14.6618C15.376 14.7328 15.509 14.7668 15.639 14.7668Z"
      fill={color}
    />
  </Svg>
);

export default TimeSquareCurvedBulkIcon;
