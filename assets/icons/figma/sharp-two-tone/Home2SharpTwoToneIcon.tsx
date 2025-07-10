import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Home2SharpTwoToneIcon component
 */
export const Home2SharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M9.70642 21.3887H3.80664V8.88605L12.1508 2.88867L20.6937 8.88605V21.3887H14.8281"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.70654 21.3885V16.3096H14.8282V21.3885"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Home2SharpTwoToneIcon;
