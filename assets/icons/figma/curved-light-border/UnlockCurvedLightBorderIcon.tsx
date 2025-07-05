import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UnlockCurvedLightBorderIcon component
 */
export const UnlockCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.9102 14.1562V16.3772"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.2761 5.98736C15.7031 4.09236 13.9311 2.72436 11.8531 2.75036C9.38612 2.78036 7.39112 4.76736 7.34912 7.23436V9.40336"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.91 8.82422C6.165 8.82422 4.25 10.3922 4.25 15.0952C4.25 19.7992 6.165 21.3672 11.91 21.3672C17.656 21.3672 19.571 19.7992 19.571 15.0952C19.571 10.3922 17.656 8.82422 11.91 8.82422Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default UnlockCurvedLightBorderIcon;
