import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DiscoveryRegularBoldIcon component
 */
export const DiscoveryRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2 12.0001C2 6.48012 6.47 2.00012 12 2.00012C17.52 2.00012 22 6.48012 22 12.0001C22 17.5301 17.52 22.0001 12 22.0001C6.47 22.0001 2 17.5301 2 12.0001ZM14.23 13.8301L15.85 8.71012C15.96 8.36012 15.64 8.03012 15.29 8.14012L10.17 9.74012C9.96 9.81012 9.79 9.97012 9.73 10.1801L8.13 15.3101C8.02 15.6501 8.35 15.9801 8.69 15.8701L13.79 14.2701C14 14.2101 14.17 14.0401 14.23 13.8301Z"
      fill={color}
    />
  </Svg>
);

export default DiscoveryRegularBoldIcon;
