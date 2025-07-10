import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VoiceCurvedBrokenIcon component
 */
export const VoiceCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M6.33105 13.6787C6.33105 16.8097 8.86905 19.3477 12.0001 19.3477C15.1321 19.3477 17.6701 16.8097 17.6701 13.6787"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12 21.4997V19.3477"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M4.86621 13.6787H19.1342"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.13005 3.2793C7.45505 4.2643 6.33105 6.0853 6.33105 8.1693V10.4233"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.67 10.423V8.169C17.67 5.038 15.132 2.5 12 2.5"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default VoiceCurvedBrokenIcon;
