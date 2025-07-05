import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LoginSharpBulkIcon component
 */
export const LoginSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path d="M21.3705 2.38867H8.93994V21.8887H21.3705V2.38867Z" fill={color} />
    <Path
      d="M17.7948 11.389C15.7828 11.388 13.9508 9.55597 13.9508 7.54297V6.79297H12.4508V7.54297C12.4508 9.01997 13.1258 10.4 14.1698 11.389L3.12951 11.3889V12.8889L14.1698 12.889C13.1258 13.878 12.4508 15.257 12.4508 16.734V17.484H13.9508V16.734C13.9508 14.722 15.7838 12.889 17.7958 12.889H18.5458V11.389H17.7948Z"
      fill={color}
    />
  </Svg>
);

export default LoginSharpBulkIcon;
