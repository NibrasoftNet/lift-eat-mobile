import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DangerCircleRegularLightOutlineIcon component
 */
export const DangerCircleRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 3.5C7.313 3.5 3.5 7.313 3.5 12C3.5 16.687 7.313 20.5 12 20.5C16.687 20.5 20.5 16.687 20.5 12C20.5 7.313 16.687 3.5 12 3.5ZM12 22C6.486 22 2 17.514 2 12C2 6.486 6.486 2 12 2C17.514 2 22 6.486 22 12C22 17.514 17.514 22 12 22Z"
      fill={color}
    />
    <Path
      d="M12.004 16.7959C11.451 16.7959 10.999 16.3489 10.999 15.7959C10.999 15.2429 11.442 14.7959 11.994 14.7959H12.004C12.557 14.7959 13.004 15.2429 13.004 15.7959C13.004 16.3489 12.557 16.7959 12.004 16.7959Z"
      fill={color}
    />
    <Path
      d="M11.9941 13.3731C11.5801 13.3731 11.2441 13.0371 11.2441 12.6231V8.2041C11.2441 7.7901 11.5801 7.4541 11.9941 7.4541C12.4081 7.4541 12.7441 7.7901 12.7441 8.2041V12.6231C12.7441 13.0371 12.4081 13.3731 11.9941 13.3731Z"
      fill={color}
    />
  </Svg>
);

export default DangerCircleRegularLightOutlineIcon;
