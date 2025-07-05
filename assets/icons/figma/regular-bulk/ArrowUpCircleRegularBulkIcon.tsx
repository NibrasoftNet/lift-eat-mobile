import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCircleRegularBulkIcon component
 */
export const ArrowUpCircleRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2 12.0001C2 6.48512 6.486 2.00012 12 2.00012C17.514 2.00012 22 6.48512 22 12.0001C22 17.5141 17.514 22.0001 12 22.0001C6.486 22.0001 2 17.5141 2 12.0001Z"
      fill={color}
    />
    <Path
      d="M7.77942 13.4425C7.77942 13.2515 7.85242 13.0595 7.99842 12.9135L11.4684 9.42652C11.6094 9.28552 11.8004 9.20652 12.0004 9.20652C12.1994 9.20652 12.3904 9.28552 12.5314 9.42652L16.0034 12.9135C16.2954 13.2065 16.2954 13.6805 16.0014 13.9735C15.7074 14.2655 15.2324 14.2645 14.9404 13.9715L12.0004 11.0185L9.06042 13.9715C8.76842 14.2645 8.29442 14.2655 8.00042 13.9735C7.85242 13.8275 7.77942 13.6345 7.77942 13.4425Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpCircleRegularBulkIcon;
