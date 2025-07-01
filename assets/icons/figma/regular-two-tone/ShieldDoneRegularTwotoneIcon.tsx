import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShieldDoneRegularTwotoneIcon component
 */
export const ShieldDoneRegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M18.865 5.12377C19.302 5.27677 19.594 5.68877 19.594 6.15177V12.9248C19.594 14.8178 18.906 16.6248 17.691 18.0248C17.08 18.7298 16.307 19.2788 15.486 19.7228L11.928 21.6448L8.364 19.7218C7.542 19.2778 6.768 18.7298 6.156 18.0238C4.94 16.6238 4.25 14.8158 4.25 12.9208V6.15177C4.25 5.68877 4.542 5.27677 4.979 5.12377L11.561 2.81077C11.795 2.72877 12.05 2.72877 12.283 2.81077L18.865 5.12377Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M9.32227 11.9176L11.2143 13.8106L15.1123 9.9126" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default ShieldDoneRegularTwotoneIcon;
