import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MessageCurvedBrokenIcon component
 */
export const MessageCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M17.569 9.05078C17.569 9.05078 14.359 12.9038 12.011 12.9038C9.66397 12.9038 6.41797 9.05078 6.41797 9.05078"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.0001 21.1168C4.85707 21.1168 2.47607 18.8368 2.47607 11.9998C2.47607 5.16181 4.85707 2.88281 12.0001 2.88281C19.1431 2.88281 21.5241 5.16181 21.5241 11.9998C21.5241 17.3778 20.0511 19.9358 15.9471 20.7828"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default MessageCurvedBrokenIcon;
