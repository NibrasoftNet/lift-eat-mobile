import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeUpSharpBrokenIcon component
 */
export const VolumeUpSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M16.6973 7.99561C18.1223 10.4856 18.1223 13.5256 16.6973 16.0076"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.418 5.37549C22.189 9.36549 22.199 14.6285 19.418 18.6255"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.3825 8.0643L11.5085 4.4873H12.2845V19.5133H11.5085L7.3825 15.9363H3.0015C2.9995 13.3123 2.9995 10.6883 3.0015 8.0643"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default VolumeUpSharpBrokenIcon;
