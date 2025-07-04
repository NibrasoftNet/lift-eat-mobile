import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SearchCurvedBrokenIcon component
 */
export const SearchCurvedBrokenIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M19.8241 11.2641C19.8241 15.9931 15.9911 19.8251 11.2631 19.8251C6.53415 19.8251 2.70215 15.9931 2.70215 11.2641C2.70215 6.53512 6.53415 2.70312 11.2631 2.70312C14.3931 2.70312 17.1311 4.38312 18.6241 6.89012" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M18.4756 19.8866C18.4756 19.1086 19.1076 18.4766 19.8866 18.4766C20.6666 18.4766 21.2976 19.1086 21.2976 19.8866C21.2976 20.6666 20.6666 21.2976 19.8866 21.2976" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default SearchCurvedBrokenIcon;
