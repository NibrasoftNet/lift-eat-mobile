import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LogoutSharpBulkIcon component
 */
export const LogoutSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M13.4233 2.38867H1.90332V21.8887H13.4233V2.38867Z" fill={color} />
    <Path d="M21.8456 11.389C19.8336 11.388 18.0016 9.55597 18.0016 7.54297V6.79297H16.5016V7.54297C16.5016 9.01997 17.1766 10.4 18.2206 11.389L7.18029 11.3889V12.8889L18.2206 12.889C17.1766 13.878 16.5016 15.257 16.5016 16.734V17.484H18.0016V16.734C18.0016 14.722 19.8346 12.889 21.8466 12.889H22.5966V11.389H21.8456Z" fill={color} />
  </Svg>
);

export default LogoutSharpBulkIcon;
