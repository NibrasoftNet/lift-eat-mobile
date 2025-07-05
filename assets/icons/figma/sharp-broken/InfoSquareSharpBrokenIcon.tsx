import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * InfoSquareSharpBrokenIcon component
 */
export const InfoSquareSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.2441 16.5342V12.5342"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2401 8.73828H12.2501"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.5 10.4967V3.28467H3V21.7847H21.5V14.8117"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default InfoSquareSharpBrokenIcon;
