import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BagCurvedLightBorderIcon component
 */
export const BagCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.9727 11.374H14.9267"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.14165 11.374H9.09565"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.3641 6.86985C16.3641 4.48385 14.4301 2.54985 12.0441 2.54985C9.65808 2.53885 7.71608 4.46485 7.70508 6.85085V6.86985"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.0344 21.4897C5.52643 21.4897 4.77743 19.4397 3.31643 14.0227C1.85043 8.58866 4.79143 6.55566 12.0344 6.55566C19.2774 6.55566 22.2184 8.58866 20.7524 14.0227C19.2914 19.4397 18.5424 21.4897 12.0344 21.4897Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default BagCurvedLightBorderIcon;
