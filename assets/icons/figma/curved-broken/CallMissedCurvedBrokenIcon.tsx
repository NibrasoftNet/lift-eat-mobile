import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallMissedCurvedBrokenIcon component
 */
export const CallMissedCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M18.6256 5.41309L15.6636 8.37509"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.6641 2.375L20.4751 3.564"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.6641 2.375L21.6641 8.375"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.03706 15.924C1.13806 9.02495 2.11906 5.86595 2.84706 4.84695C2.94006 4.68395 5.24206 1.23695 7.71106 3.25895C13.8371 8.30495 6.08106 7.59095 11.2261 12.736C16.3701 17.881 15.6571 10.125 20.7021 16.25C22.7241 18.719 19.2771 21.02 19.1141 21.114C18.2351 21.742 15.7641 22.558 10.6751 18.344"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CallMissedCurvedBrokenIcon;
