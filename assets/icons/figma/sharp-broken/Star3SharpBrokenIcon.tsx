import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star3SharpBrokenIcon component
 */
export const Star3SharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M17.577 10.5483L21.5 12.0003L14.75 14.4983L12.25 21.2503L9.75 14.4983"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.674 13.36L3 12L9.75 9.502L12.25 2.75L14.75 9.502"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Star3SharpBrokenIcon;
