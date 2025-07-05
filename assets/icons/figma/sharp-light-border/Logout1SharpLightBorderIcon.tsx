import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Logout1SharpLightBorderIcon component
 */
export const Logout1SharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M21.019 11.9997L8.24121 11.9997"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.479 8.7251L21.7686 12.0001L18.479 15.2761"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.2554 16.625L13.2554 21.25L2.73144 21.25L2.73144 2.75L13.2554 2.75L13.2554 7.375"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Logout1SharpLightBorderIcon;
