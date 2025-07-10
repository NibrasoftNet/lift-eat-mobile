import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeDownRegularLightBorderIcon component
 */
export const VolumeDownRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M18.5811 8.31445C19.8924 10.6051 19.8924 13.4026 18.5811 15.6861"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M4.00185 12.0001C3.99906 13.2298 3.94419 14.907 4.70494 15.5339C5.41453 16.1187 5.91395 15.968 7.20945 16.0631C8.50587 16.1591 11.242 19.97 13.3512 18.7646C14.4393 17.9089 14.5202 16.1151 14.5202 12.0001C14.5202 7.88515 14.4393 6.09135 13.3512 5.23571C11.242 4.02938 8.50587 7.84121 7.20945 7.93717C5.91395 8.03225 5.41453 7.88157 4.70494 8.46635C3.94419 9.09328 3.99906 10.7705 4.00185 12.0001Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default VolumeDownRegularLightBorderIcon;
