import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ActivityRegularTwotoneIcon component
 */
export const ActivityRegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M7.24463 14.7815L10.2378 10.8914L13.652 13.5733L16.581 9.79297" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.9243 3.12012H7.65655C4.64511 3.12012 2.77783 5.25284 2.77783 8.26428V16.3467C2.77783 19.3581 4.6085 21.4817 7.65655 21.4817H16.2607C19.2721 21.4817 21.1394 19.3581 21.1394 16.3467V9.30776" fill={none} stroke={color} strokeWidth="1.5" />
    <Circle cx="19.9954" cy="4.20027" r="1.9222" fill={none} stroke={color} />
  </Svg>
);

export default ActivityRegularTwotoneIcon;
