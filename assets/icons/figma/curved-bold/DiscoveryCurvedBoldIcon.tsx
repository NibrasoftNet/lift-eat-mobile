import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DiscoveryCurvedBoldIcon component
 */
export const DiscoveryCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M15.868 9.228L14.451 13.756C14.385 13.968 14.219 14.134 14.008 14.2L9.478 15.618C9.411 15.639 9.344 15.649 9.276 15.649C9.1 15.649 8.927 15.58 8.798 15.451C8.621 15.274 8.556 15.012 8.631 14.772L10.049 10.242C10.115 10.03 10.281 9.865 10.492 9.799L15.022 8.382C15.262 8.305 15.524 8.371 15.701 8.549C15.879 8.727 15.943 8.989 15.868 9.228ZM12.25 2.25C5.051 2.25 2.5 4.802 2.5 12C2.5 19.198 5.051 21.75 12.25 21.75C19.449 21.75 22 19.198 22 12C22 4.802 19.449 2.25 12.25 2.25Z"
      fill={color}
    />
  </Svg>
);

export default DiscoveryCurvedBoldIcon;
