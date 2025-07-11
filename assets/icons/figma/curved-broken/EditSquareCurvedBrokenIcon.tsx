import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EditSquareCurvedBrokenIcon component
 */
export const EditSquareCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 21.25C18.937 21.25 21.25 18.937 21.25 12"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12 2.75C5.063 2.75 2.75 5.063 2.75 12C2.75 17.553 4.232 20.143 8.382 20.955"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.529 4.30364V4.30364C18.536 3.42464 17.019 3.51664 16.14 4.50964C16.14 4.50964 11.771 9.44464 10.256 11.1576C8.73901 12.8696 9.85101 15.2346 9.85101 15.2346C9.85101 15.2346 12.355 16.0276 13.849 14.3396C15.344 12.6516 19.735 7.69264 19.735 7.69264C20.614 6.69964 20.521 5.18264 19.529 4.30364Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.0093 5.80078L16.8223 7.40578"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default EditSquareCurvedBrokenIcon;
