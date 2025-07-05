import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeSquareCurvedBoldIcon component
 */
export const TimeSquareCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M16.284 14.401C16.144 14.636 15.895 14.767 15.639 14.767C15.509 14.767 15.376 14.733 15.256 14.662L11.865 12.639C11.638 12.504 11.499 12.258 11.499 11.995V7.633C11.499 7.219 11.835 6.883 12.249 6.883C12.663 6.883 12.999 7.219 12.999 7.633V11.569L16.024 13.373C16.38 13.586 16.496 14.046 16.284 14.401ZM12.25 2.25C5.051 2.25 2.5 4.801 2.5 12C2.5 19.198 5.051 21.75 12.25 21.75C19.449 21.75 22 19.198 22 12C22 4.801 19.449 2.25 12.25 2.25Z"
      fill={color}
    />
  </Svg>
);

export default TimeSquareCurvedBoldIcon;
