import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LocationSharpTwoToneIcon component
 */
export const LocationSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M14.7368 10.8064C14.7368 9.43255 13.6236 8.31934 12.2507 8.31934C10.8769 8.31934 9.76367 9.43255 9.76367 10.8064C9.76367 12.1792 10.8769 13.2924 12.2507 13.2924C13.6236 13.2924 14.7368 12.1792 14.7368 10.8064Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2498 21.25C12.2498 21.25 4.97391 16.5108 4.79058 10.5973C4.66185 6.4451 8.12963 2.75008 12.2498 2.75008C16.3699 2.75008 19.8368 6.44504 19.7099 10.5973C19.5255 16.632 12.2498 21.25 12.2498 21.25Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default LocationSharpTwoToneIcon;
