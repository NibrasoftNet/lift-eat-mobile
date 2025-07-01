import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ActivitySharpTwoToneIcon component
 */
export const ActivitySharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M7.4668 15.2545L10.2723 11.6082L13.4725 14.122L16.218 10.5786" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.6654 4.32422H3.28027V21.5349H20.4909V10.124" fill={none} stroke={color} strokeWidth="1.5" />
    <Circle cx="19.4179" cy="5.33638" r="1.80171" fill={none} stroke={color} />
  </Svg>
);

export default ActivitySharpTwoToneIcon;
