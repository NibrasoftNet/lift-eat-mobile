import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Notification2SharpTwoToneIcon component
 */
export const Notification2SharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M15.4173 17.9961V18.2221C15.4173 19.971 13.9996 21.3888 12.2507 21.3888C10.5017 21.3888 9.08398 19.971 9.08398 18.2221V17.9961" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.2496 2.88867C8.83222 2.88867 6.06186 5.65903 6.06186 9.07645V13.657L4.44922 15.2917V17.9959H20.05V15.2917L18.4374 13.657V9.07645" fill={none} stroke={color} strokeWidth="1.5" />
    <Circle cx="16.5879" cy="4.96289" r="2.34473" fill={none} stroke={color} />
  </Svg>
);

export default Notification2SharpTwoToneIcon;
