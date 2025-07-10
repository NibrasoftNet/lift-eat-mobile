import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight3SharpLightBorderIcon component
 */
export const ArrowRight3SharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M20.249 12L4.24926 12"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.5894 17.66C14.5894 14.7503 17.1519 12 20.2494 12"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.5894 6.33995C14.5894 9.2497 17.1519 12 20.2494 12"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowRight3SharpLightBorderIcon;
