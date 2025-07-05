import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VideoSharpBulkIcon component
 */
export const VideoSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M0.878906 19.9097H16.3589V5.15967H0.878906V19.9097Z"
      fill={color}
    />
    <Path d="M12.4886 10.3696H7.78857V8.86963H12.4886V10.3696Z" fill={color} />
    <Path
      d="M17.6277 9.65043V15.1754L23.6217 19.5194V5.58643L17.6277 9.65043Z"
      fill={color}
    />
  </Svg>
);

export default VideoSharpBulkIcon;
