import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight3CurvedBoldIcon component
 */
export const ArrowRight3CurvedBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M15.2372 6.95745C14.4612 6.63645 13.5952 6.38045 13.0632 6.91445C12.6192 7.36045 12.3662 9.08745 12.3012 10.9994H4.0752C3.5222 10.9994 3.0752 11.4464 3.0752 11.9994C3.0752 12.5524 3.5222 12.9994 4.0752 12.9994H12.3022C12.3672 14.9074 12.6202 16.6284 13.0642 17.0724C13.2982 17.3064 13.5952 17.3944 13.9182 17.3944C14.3712 17.3944 14.8732 17.2204 15.3122 17.0384C16.8832 16.3884 21.4242 13.6424 21.4242 11.9924C21.4242 10.2894 16.6772 7.55445 15.2372 6.95745Z" fill={color} />
  </Svg>
);

export default ArrowRight3CurvedBoldIcon;
