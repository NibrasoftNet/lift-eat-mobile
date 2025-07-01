import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Heart2SharpBulkIcon component
 */
export const Heart2SharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M17.6901 3.50924C15.5931 2.83324 13.6841 3.39624 12.2501 5.09424C10.8151 3.39624 8.90609 2.83324 6.80909 3.50924C4.16309 4.36224 2.51209 6.75424 2.50009 9.75024C2.47509 14.8842 7.41609 18.9062 12.0481 20.9572L12.2511 21.0472L12.4541 20.9572C17.0851 18.9052 22.0251 14.8832 22.0001 9.74924C21.9881 6.75324 20.3371 4.36224 17.6901 3.50924Z" fill={color} />
    <Path d="M12.3275 14.5223C14.0065 14.5223 15.6545 13.4783 16.6405 11.7843L17.0175 11.1363L15.7215 10.3813L15.3445 11.0293C14.7745 12.0093 13.6735 13.0653 12.2565 13.0213C10.8495 13.0733 9.76353 12.0083 9.19353 11.0293L8.81653 10.3813L7.51953 11.1363L7.89753 11.7843C8.88353 13.4783 10.5315 14.5223 12.1855 14.5223H12.3275Z" fill={color} />
  </Svg>
);

export default Heart2SharpBulkIcon;
