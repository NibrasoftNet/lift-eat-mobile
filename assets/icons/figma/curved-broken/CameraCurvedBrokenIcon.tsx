import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CameraCurvedBrokenIcon component
 */
export const CameraCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.7685 14.3714C15.0095 13.9264 15.1455 13.4174 15.1455 12.8764C15.1455 11.1394 13.7375 9.73145 12.0005 9.73145C10.2635 9.73145 8.85449 11.1394 8.85449 12.8764C8.85449 14.6134 10.2635 16.0214 12.0005 16.0214"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.9996 20.5788C20.0456 20.5788 21.0036 18.1688 21.0036 12.9458C21.0036 9.28382 20.5186 7.32582 17.4696 6.48282C17.1896 6.39482 16.8786 6.22682 16.6276 5.94982C16.2216 5.50382 15.9246 4.13682 14.9436 3.72282C13.9626 3.31082 10.0226 3.32982 9.05658 3.72282C8.09258 4.11782 7.77858 5.50382 7.37258 5.94982C7.12158 6.22682 6.81158 6.39482 6.53058 6.48282C3.48158 7.32582 2.99658 9.28382 2.99658 12.9458C2.99658 16.6738 3.48458 18.9688 6.68958 19.9768"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.9115 9.37891H16.9205"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CameraCurvedBrokenIcon;
