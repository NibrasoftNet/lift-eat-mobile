import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallSilentCurvedTwoToneIcon component
 */
export const CallSilentCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M6.10856 13.0575C1.52258 7.69624 2.37077 5.12706 3.00878 4.22467C3.10432 4.0548 5.40793 0.615083 7.86971 2.6322C12.7211 6.6346 8.86864 7.01679 9.61174 9.55411"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.5856 12.3145C16.5123 17.06 15.886 9.58603 20.8637 15.6268C22.8913 18.1004 19.4412 20.3936 19.2714 20.4891C18.2745 21.211 15.1631 22.1771 8.40088 15.4994"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M2 21.5L20.5 3" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default CallSilentCurvedTwoToneIcon;
