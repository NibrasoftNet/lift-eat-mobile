import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SearchCurvedLightBorderIcon component
 */
export const SearchCurvedLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11.2753 2.71387C16.0029 2.71387 19.8363 6.54625 19.8363 11.2748C19.8363 16.0034 16.0029 19.8358 11.2753 19.8358C6.54674 19.8358 2.71436 16.0034 2.71436 11.2748C2.71436 6.54625 6.54674 2.71387 11.2753 2.71387Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M19.8987 18.4873C20.6778 18.4873 21.3092 19.1197 21.3092 19.8978C21.3092 20.6778 20.6778 21.3092 19.8987 21.3092C19.1197 21.3092 18.4873 20.6778 18.4873 19.8978C18.4873 19.1197 19.1197 18.4873 19.8987 18.4873Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default SearchCurvedLightBorderIcon;
