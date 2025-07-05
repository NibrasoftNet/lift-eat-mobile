import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShieldDoneCurvedTwoToneIcon component
 */
export const ShieldDoneCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.9846 21.606C14.3196 21.606 19.6566 19.284 19.6566 12.879C19.6566 6.47498 19.9346 5.97398 19.3196 5.35798C18.7036 4.74198 15.4936 2.75098 11.9846 2.75098C8.47557 2.75098 5.26557 4.74198 4.65057 5.35798C4.03457 5.97398 4.31257 6.47498 4.31257 12.879C4.31257 19.284 9.65057 21.606 11.9846 21.606Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.38574 11.8751L11.2777 13.7701L15.1757 9.87012"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ShieldDoneCurvedTwoToneIcon;
