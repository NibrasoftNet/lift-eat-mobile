import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Location2SharpBrokenIcon component
 */
export const Location2SharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M14.6486 9.73887C14.6486 8.41287 13.5746 7.33887 12.2496 7.33887C10.9236 7.33887 9.84863 8.41287 9.84863 9.73887C9.84863 11.0639 10.9236 12.1389 12.2496 12.1389"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.04383 5.84867C7.30983 3.66767 9.64383 2.13867 12.2478 2.13867C16.2238 2.13867 19.5708 5.70467 19.4478 9.71267C19.2698 15.5367 12.2478 18.4397 12.2478 22.1387C12.2478 18.5357 5.22583 15.4197 5.04883 9.71267"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Location2SharpBrokenIcon;
