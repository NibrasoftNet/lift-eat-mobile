import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpRegularLightBorderIcon component
 */
export const ArrowUpRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.7261 4.25L11.7261 19.25"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M5.70149 10.2998L11.7255 4.2498L17.7505 10.2998"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowUpRegularLightBorderIcon;
