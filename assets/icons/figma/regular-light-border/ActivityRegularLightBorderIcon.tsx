import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ActivityRegularLightBorderIcon component
 */
export const ActivityRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.24463 14.7815L10.2378 10.8914L13.652 13.5733L16.581 9.79297"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.9243 3.12024H7.65655C4.64511 3.12024 2.77783 5.25296 2.77783 8.2644V16.3468C2.77783 19.3582 4.6085 21.4818 7.65655 21.4818H16.2607C19.2721 21.4818 21.1394 19.3582 21.1394 16.3468V9.30788"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Circle cx="19.9954" cy="4.20027" r="1.9222" fill='none' stroke={color} />
  </Svg>
);

export default ActivityRegularLightBorderIcon;
