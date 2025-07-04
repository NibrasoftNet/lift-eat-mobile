import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallSilentSharpBulkIcon component
 */
export const CallSilentSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M16.8854 14.032L13.9404 15.727C13.5884 15.605 12.7894 15.284 11.8934 14.675L19.8644 6.17297L18.7694 5.14697L3.12842 21.831L4.22342 22.857L8.38142 18.421C10.4414 20.175 13.5224 22.013 17.4384 22.013C17.6274 22.013 17.8204 22.009 18.0134 22L18.1324 21.994L18.2354 21.936C19.8384 21.038 21.0014 19.874 21.8984 18.273L22.1134 17.888L16.8854 14.032Z" fill={color} />
    <Path d="M6.20799 16.2596L9.59199 12.4266L9.39499 12.1106C8.92199 11.3506 8.67999 10.6896 8.58299 10.3826L10.282 7.43156L6.58399 2.35156L6.19299 2.58156C4.61099 3.50956 3.45099 4.67056 2.54199 6.23356L2.48299 6.39256C2.00699 8.93556 3.32299 12.6256 5.83699 15.7926L6.20799 16.2596Z" fill={color} />
  </Svg>
);

export default CallSilentSharpBulkIcon;
