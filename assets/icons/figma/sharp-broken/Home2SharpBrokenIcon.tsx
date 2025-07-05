import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Home2SharpBrokenIcon component
 */
export const Home2SharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M9.70564 16.3097H14.8276V21.3887H20.6936V8.88567L12.1506 2.88867L3.80664 8.88567V21.3887H9.70564"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Home2SharpBrokenIcon;
