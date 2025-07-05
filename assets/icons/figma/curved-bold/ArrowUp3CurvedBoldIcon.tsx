import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp3CurvedBoldIcon component
 */
export const ArrowUp3CurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M17.2844 8.92824C16.6334 7.35924 13.8874 2.82324 12.2424 2.82324C10.5474 2.82324 7.81036 7.56124 7.21336 9.00024C6.88836 9.78224 6.62836 10.6532 7.16136 11.1882C7.69636 11.7242 9.50836 11.9092 11.2534 11.9582V20.1762C11.2534 20.7292 11.7004 21.1762 12.2534 21.1762C12.8054 21.1762 13.2534 20.7292 13.2534 20.1762V11.9652C15.4904 11.9122 16.8604 11.6522 17.3244 11.1882C17.8874 10.6232 17.5974 9.68424 17.2844 8.92824Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUp3CurvedBoldIcon;
