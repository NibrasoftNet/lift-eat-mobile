import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * InfoSquareRegularLightOutlineIcon component
 */
export const InfoSquareRegularLightOutlineIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M2 2H21.9999V22H2V2Z" fill={"white"} />
    <Path d="M7.664 3.5C5.135 3.5 3.5 5.233 3.5 7.916V16.084C3.5 18.767 5.135 20.5 7.664 20.5H16.332C18.864 20.5 20.5 18.767 20.5 16.084V7.916C20.5 5.233 18.864 3.5 16.334 3.5H7.664ZM16.332 22H7.664C4.276 22 2 19.622 2 16.084V7.916C2 4.378 4.276 2 7.664 2H16.334C19.723 2 22 4.378 22 7.916V16.084C22 19.622 19.723 22 16.332 22Z" fill={color} />
    <Path d="M11.9941 16.75C11.5801 16.75 11.2441 16.414 11.2441 16V12C11.2441 11.586 11.5801 11.25 11.9941 11.25C12.4081 11.25 12.7441 11.586 12.7441 12V16C12.7441 16.414 12.4081 16.75 11.9941 16.75Z" fill={color} />
    <Path d="M11.9991 9.2041C11.4461 9.2041 10.9941 8.7571 10.9941 8.2041C10.9941 7.6511 11.4371 7.2041 11.9891 7.2041H11.9991C12.5521 7.2041 12.9991 7.6511 12.9991 8.2041C12.9991 8.7571 12.5521 9.2041 11.9991 9.2041Z" fill={color} />
  </Svg>
);

export default InfoSquareRegularLightOutlineIcon;
