import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HeartCurvedBulkIcon component
 */
export const HeartCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M17.8248 3.28355C16.1048 2.73355 13.7238 2.96155 12.2378 4.64755C10.6768 2.97355 8.37679 2.73055 6.66879 3.28455C2.75379 4.54455 1.53279 9.08055 2.64679 12.5596V12.5606C4.40479 18.0316 10.2498 20.9825 12.2518 20.9825C14.0388 20.9825 20.1158 18.0865 21.8538 12.5596C22.9678 9.08155 21.7438 4.54555 17.8248 3.28355Z" fill={color} />
    <Path d="M17.8817 10.6976H17.9067C18.3087 10.6976 18.6417 10.3786 18.6557 9.97264C18.7147 8.22664 17.6737 6.94364 16.0657 6.77964C15.6557 6.73564 15.2857 7.03864 15.2427 7.44964C15.2007 7.86164 15.5007 8.22964 15.9127 8.27164C16.7237 8.35464 17.1887 8.97164 17.1567 9.92264C17.1427 10.3366 17.4677 10.6826 17.8817 10.6976Z" fill={color} />
  </Svg>
);

export default HeartCurvedBulkIcon;
