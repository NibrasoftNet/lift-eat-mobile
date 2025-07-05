import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VoiceSharpBulkIcon component
 */
export const VoiceSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path d="M4.49512 13.2287V7.33887H2.99512V13.2287H4.49512Z" fill={color} />
    <Path d="M21.5049 7.33887V13.2287H20.0049V7.33887H21.5049Z" fill={color} />
    <Path
      d="M13.0003 16.8389V21.229H15.7198V22.729H8.77954V21.229H11.5003V16.8389H13.0003Z"
      fill={color}
    />
    <Path
      d="M12.2504 2.479C9.60545 2.479 7.46484 4.63289 7.46484 7.28445V13.2846C7.46484 15.9363 9.60562 18.0889 12.2504 18.0889C14.8963 18.0889 17.0359 15.9362 17.0359 13.2846V7.28445C17.0359 4.63298 14.8965 2.479 12.2504 2.479Z"
      fill={color}
    />
  </Svg>
);

export default VoiceSharpBulkIcon;
