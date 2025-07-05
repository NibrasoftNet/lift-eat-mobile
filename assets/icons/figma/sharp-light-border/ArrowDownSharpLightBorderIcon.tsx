import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownSharpLightBorderIcon component
 */
export const ArrowDownSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path d="M12.25 18.9002V4.5" fill={none} stroke={color} strokeWidth="1.5" />
    <Path
      d="M18.2746 13.4502L12.2506 19.5002L6.22559 13.4502"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowDownSharpLightBorderIcon;
