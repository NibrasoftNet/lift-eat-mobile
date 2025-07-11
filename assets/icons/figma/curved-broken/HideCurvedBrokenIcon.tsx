import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HideCurvedBrokenIcon component
 */
export const HideCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M4.30212 15.7261C3.31812 14.5471 2.74512 13.2211 2.74512 12.0041C2.74512 8.7241 6.88512 4.7041 11.9951 4.7041C14.0851 4.7041 16.0251 5.3741 17.5851 6.4141"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.8452 8.47363C20.7362 9.60363 21.2552 10.8536 21.2552 12.0036C21.2552 15.2836 17.1052 19.3036 11.9952 19.3036C11.0852 19.3036 10.1962 19.1736 9.36523 18.9436"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.1054 12.5625C14.8714 13.8545 13.8604 14.8675 12.5684 15.1045"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.76096 14.23C9.16596 13.641 8.83296 12.838 8.83596 12.001C8.83196 10.256 10.244 8.83796 11.99 8.83496"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.8873 4.11328L4.11328 19.8873"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default HideCurvedBrokenIcon;
