import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UnlockSharpBrokenIcon component
 */
export const UnlockSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.1104 14.8071V17.0281"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.61765 21.854H19.8596V9.98096H4.63965V21.854"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.69043 9.83705V7.90505V7.88505C7.70043 5.37105 9.75043 3.34305 12.2604 3.35405C13.5704 3.35405 14.7504 3.90705 15.5804 4.79205"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default UnlockSharpBrokenIcon;
