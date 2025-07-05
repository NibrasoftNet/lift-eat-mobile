import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star3SharpLightBorderIcon component
 */
export const Star3SharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 2.75L14.7483 9.50166L21.5 12L14.7483 14.4983L12.25 21.25L9.75166 14.4983L3 12L9.75166 9.50166L12.25 2.75Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Star3SharpLightBorderIcon;
