import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreCircleRegularBulkIcon component
 */
export const MoreCircleRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M22 11.9998C22 17.5238 17.523 21.9998 12 21.9998C6.477 21.9998 2 17.5238 2 11.9998C2 6.47776 6.477 1.99976 12 1.99976C17.523 1.99976 22 6.47776 22 11.9998Z"
      fill={color}
    />
    <Path
      d="M7.52075 10.8035C6.85975 10.8035 6.32275 11.3405 6.32275 11.9995C6.32275 12.6595 6.85975 13.1975 7.52075 13.1975C8.18175 13.1975 8.71875 12.6595 8.71875 11.9995C8.71875 11.3405 8.18175 10.8035 7.52075 10.8035ZM11.9999 10.8035C11.3389 10.8035 10.8019 11.3405 10.8019 11.9995C10.8019 12.6595 11.3389 13.1975 11.9999 13.1975C12.6609 13.1975 13.1979 12.6595 13.1979 11.9995C13.1979 11.3405 12.6609 10.8035 11.9999 10.8035ZM15.2813 11.9995C15.2813 11.3405 15.8183 10.8035 16.4793 10.8035C17.1403 10.8035 17.6773 11.3405 17.6773 11.9995C17.6773 12.6595 17.1403 13.1975 16.4793 13.1975C15.8183 13.1975 15.2813 12.6595 15.2813 11.9995Z"
      fill={color}
    />
  </Svg>
);

export default MoreCircleRegularBulkIcon;
