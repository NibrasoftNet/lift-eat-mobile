import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UserCurvedTwoToneIcon component
 */
export const UserCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.9728 20.3681C8.7338 20.3681 5.9668 19.8781 5.9668 17.9161C5.9668 15.9541 8.7158 14.2461 11.9728 14.2461C15.2118 14.2461 17.9788 15.9381 17.9788 17.8991C17.9788 19.8601 15.2298 20.3681 11.9728 20.3681Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.9434 13.5449C20.6974 13.5449 22.1954 14.7339 22.1954 15.7959C22.1954 16.4209 21.6784 17.1019 20.8944 17.2859"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M5.002 13.5449C3.248 13.5449 1.75 14.7339 1.75 15.7959C1.75 16.4209 2.267 17.1019 3.052 17.2859"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.3623 10.392C19.5993 10.061 20.5113 8.93302 20.5113 7.59002C20.5113 6.18902 19.5183 5.01902 18.1963 4.74902"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M5.58408 10.392C4.34608 10.061 3.43408 8.93302 3.43408 7.59002C3.43408 6.18902 4.42808 5.01902 5.74908 4.74902"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.9726 11.449C14.0986 11.449 15.8226 9.726 15.8226 7.6C15.8226 5.474 14.0986 3.75 11.9726 3.75C9.84657 3.75 8.12257 5.474 8.12257 7.6C8.11657 9.718 9.82657 11.442 11.9456 11.449H11.9726Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default UserCurvedTwoToneIcon;
