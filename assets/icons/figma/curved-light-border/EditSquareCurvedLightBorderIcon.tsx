import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EditSquareCurvedLightBorderIcon component
 */
export const EditSquareCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 2.75C5.063 2.75 2.75 5.063 2.75 12C2.75 18.937 5.063 21.25 12 21.25C18.937 21.25 21.25 18.937 21.25 12"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.5285 4.30364V4.30364C18.5355 3.42464 17.0185 3.51664 16.1395 4.50964C16.1395 4.50964 11.7705 9.44464 10.2555 11.1576C8.73853 12.8696 9.85053 15.2346 9.85053 15.2346C9.85053 15.2346 12.3545 16.0276 13.8485 14.3396C15.3435 12.6516 19.7345 7.69264 19.7345 7.69264C20.6135 6.69964 20.5205 5.18264 19.5285 4.30364Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.0088 5.80078L18.6038 8.98378"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default EditSquareCurvedLightBorderIcon;
