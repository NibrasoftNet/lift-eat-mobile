import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperCurvedTwoToneIcon component
 */
export const PaperCurvedTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M14.3053 15.4502H8.90527" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.2603 11.4385H8.9043" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M20.1599 8.3L14.4899 2.9C13.7599 2.8 12.9399 2.75 12.0399 2.75C5.7499 2.75 3.6499 5.07 3.6499 12C3.6499 18.94 5.7499 21.25 12.0399 21.25C18.3399 21.25 20.4399 18.94 20.4399 12C20.4399 10.58 20.3499 9.35 20.1599 8.3Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M13.9341 2.83301V5.49401C13.9341 7.35201 15.4401 8.85701 17.2981 8.85701H20.2491" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PaperCurvedTwoToneIcon;
