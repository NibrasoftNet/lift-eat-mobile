import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeUpCurvedBrokenIcon component
 */
export const VolumeUpCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M16.9939 8.26367C18.2759 10.5867 18.2759 13.4217 16.9939 15.7357" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M19.4409 5.82129C21.9339 9.54129 21.9419 14.4503 19.4409 18.1783" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M3.71568 8.41766C2.68668 9.29166 2.68468 10.7537 2.68668 11.9997C2.68468 13.2457 2.68668 14.7077 3.71568 15.5817C4.74568 16.4557 5.56268 16.0947 6.89468 16.5337C8.22668 16.9727 10.0937 19.6797 12.1547 18.4567C13.2697 17.6647 13.7947 16.1707 13.7947 11.9997C13.7947 7.82866 13.2937 6.35066 12.1547 5.54266C10.0937 4.32066 8.22668 7.02766 6.89468 7.46566" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default VolumeUpCurvedBrokenIcon;
