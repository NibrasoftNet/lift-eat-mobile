import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown3CurvedLightOutlineIcon component
 */
export const ArrowDown3CurvedLightOutlineIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M17.0398 14.8627C17.2278 14.4097 17.3938 13.9267 17.3938 13.4967C17.3938 13.1877 17.3088 12.9067 17.0848 12.6837C16.6194 12.2201 14.7608 11.9629 12.75 11.9123L12.75 3.69551C12.75 3.28151 12.414 2.94551 12 2.94551C11.586 2.94551 11.25 3.28151 11.25 3.69551L11.25 11.9127C9.24346 11.9642 7.39095 12.2215 6.92683 12.6847C6.36383 13.2487 6.65083 14.1817 6.96083 14.9347C7.61183 16.5077 10.3588 21.0547 12.0068 21.0547C13.7078 21.0547 16.4428 16.3047 17.0398 14.8627ZM15.8748 13.6847C15.6348 14.9807 12.9638 19.0477 12.0048 19.5337C11.0088 19.0497 8.31383 14.9817 8.11583 13.7087C9.36983 13.2957 14.6728 13.3027 15.8748 13.6847Z" fill={color} />
  </Svg>
);

export default ArrowDown3CurvedLightOutlineIcon;
