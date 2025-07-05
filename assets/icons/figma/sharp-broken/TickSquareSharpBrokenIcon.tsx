import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TickSquareSharpBrokenIcon component
 */
export const TickSquareSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M8.62012 11.7931C10.7101 13.1141 12.2701 15.4741 12.2701 15.4741H12.3001C12.3001 15.4741 15.6201 9.60607 21.7801 5.99707"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.8587 4.68016C15.4407 3.79616 13.7647 3.28516 11.9697 3.28516C6.85973 3.28516 2.71973 7.42616 2.71973 12.5342C2.71973 17.6432 6.85973 21.7842 11.9697 21.7842C17.0797 21.7842 21.2197 17.6432 21.2197 12.5342C21.2197 10.6612 20.6637 8.91716 19.7057 7.46116"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default TickSquareSharpBrokenIcon;
