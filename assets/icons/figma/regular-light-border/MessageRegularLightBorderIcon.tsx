import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MessageRegularLightBorderIcon component
 */
export const MessageRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M17.9028 8.8512L13.4596 12.4642C12.6201 13.1302 11.4389 13.1302 10.5994 12.4642L6.11865 8.8512"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.9089 21C19.9502 21.0084 22 18.5095 22 15.4384V8.57001C22 5.49883 19.9502 3 16.9089 3H7.09114C4.04979 3 2 5.49883 2 8.57001V15.4384C2 18.5095 4.04979 21.0084 7.09114 21H16.9089Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default MessageRegularLightBorderIcon;
