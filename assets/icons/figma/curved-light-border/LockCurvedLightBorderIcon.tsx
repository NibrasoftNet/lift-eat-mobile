import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LockCurvedLightBorderIcon component
 */
export const LockCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.9106 14.1562V16.3772"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.4711 9.40335V7.25435C16.4401 4.73535 14.3721 2.71935 11.8541 2.75035C9.3871 2.78135 7.3921 4.76735 7.3501 7.23435V9.40335"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.9105 8.82422C6.16549 8.82422 4.25049 10.3922 4.25049 15.0952C4.25049 19.7992 6.16549 21.3672 11.9105 21.3672C17.6555 21.3672 19.5715 19.7992 19.5715 15.0952C19.5715 10.3922 17.6555 8.82422 11.9105 8.82422Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default LockCurvedLightBorderIcon;
