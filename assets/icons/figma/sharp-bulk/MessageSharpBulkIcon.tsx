import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MessageSharpBulkIcon component
 */
export const MessageSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path d="M1.75 22.0347H22.75V3.03467H1.75V22.0347Z" fill={color} />
    <Path
      d="M5.46973 9.49459L12.2897 15.0356L19.1087 9.49359L18.1627 8.32959L12.2897 13.1026L6.41473 8.32959L5.46973 9.49459Z"
      fill={color}
    />
  </Svg>
);

export default MessageSharpBulkIcon;
