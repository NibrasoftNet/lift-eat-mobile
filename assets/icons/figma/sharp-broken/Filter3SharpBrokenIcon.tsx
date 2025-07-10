import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Filter3SharpBrokenIcon component
 */
export const Filter3SharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M15.101 4.01074H3.25V7.71474L10 14.6017V21.1967L14.5 19.4377V14.6017L21.25 7.71474V4.01074"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Filter3SharpBrokenIcon;
