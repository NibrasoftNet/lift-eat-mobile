import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ProfileCurvedBoldIcon component
 */
export const ProfileCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2503 13.8306C8.33727 13.8306 4.90527 16.1326 4.90527 18.7556C4.90527 22.1306 10.4343 22.1306 12.2503 22.1306C14.0663 22.1306 19.5943 22.1306 19.5943 18.7336C19.5943 16.1216 16.1623 13.8306 12.2503 13.8306Z"
      fill={color}
    />
    <Path
      d="M12.2118 11.6421H12.2428C14.9378 11.6421 17.1298 9.45014 17.1298 6.75514C17.1298 4.06114 14.9378 1.86914 12.2428 1.86914C9.5478 1.86914 7.3558 4.06114 7.3558 6.75314C7.3468 9.43914 9.5238 11.6321 12.2118 11.6421Z"
      fill={color}
    />
  </Svg>
);

export default ProfileCurvedBoldIcon;
