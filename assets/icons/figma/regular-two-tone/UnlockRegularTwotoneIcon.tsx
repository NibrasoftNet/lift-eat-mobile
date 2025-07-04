import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UnlockRegularTwotoneIcon component
 */
export const UnlockRegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M16.4242 5.56204C15.8072 3.78004 14.1142 2.50004 12.1222 2.50004C9.60925 2.49004 7.56325 4.51804 7.55225 7.03104V7.05104V9.19804" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.933 21.0005H8.292C6.198 21.0005 4.5 19.3025 4.5 17.2075V12.9195C4.5 10.8245 6.198 9.12646 8.292 9.12646H15.933C18.027 9.12646 19.725 10.8245 19.725 12.9195V17.2075C19.725 19.3025 18.027 21.0005 15.933 21.0005Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.1128 13.9526V16.1746" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default UnlockRegularTwotoneIcon;
