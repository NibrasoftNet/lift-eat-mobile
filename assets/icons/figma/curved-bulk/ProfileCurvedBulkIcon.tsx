import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ProfileCurvedBulkIcon component
 */
export const ProfileCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2503 13.8301C8.33727 13.8301 4.90527 16.1321 4.90527 18.7551C4.90527 22.1301 10.4343 22.1301 12.2503 22.1301C14.0663 22.1301 19.5943 22.1301 19.5943 18.7331C19.5943 16.1211 16.1623 13.8301 12.2503 13.8301Z"
      fill={color}
    />
    <Path
      d="M12.2115 11.6421H12.2425C14.9375 11.6421 17.1295 9.45014 17.1295 6.75514C17.1295 4.06114 14.9375 1.86914 12.2425 1.86914C9.5475 1.86914 7.3555 4.06114 7.3555 6.75314C7.3465 9.43914 9.5235 11.6321 12.2115 11.6421Z"
      fill={color}
    />
  </Svg>
);

export default ProfileCurvedBulkIcon;
