import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ScanRegularLightBorderIcon component
 */
export const ScanRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M22.5 12.8055H1.5" fill={none} stroke={color} strokeWidth="1.5" />
    <Path
      d="M20.6299 12.8046V16.8786C20.6299 18.9406 18.9589 20.6116 16.8969 20.6116H15.6919"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M3.37012 12.8046V16.8786C3.37012 18.9406 5.04112 20.6116 7.10312 20.6116H8.33912"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.6299 8.5951V7.0821C20.6299 5.0211 18.9589 3.3501 16.8969 3.3501H15.6919"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M3.37012 8.5951V7.0821C3.37012 5.0211 5.04112 3.3501 7.10312 3.3501H8.33912"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ScanRegularLightBorderIcon;
