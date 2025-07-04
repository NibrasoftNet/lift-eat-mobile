import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftCircleCurvedBoldIcon component
 */
export const ArrowLeftCircleCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M14.114 14.853C14.455 15.087 14.542 15.554 14.307 15.896C14.162 16.108 13.927 16.221 13.688 16.221C13.542 16.221 13.394 16.178 13.264 16.089C11.843 15.114 9.46 13.285 9.46 12.001C9.46 10.718 11.843 8.888 13.264 7.912C13.608 7.678 14.073 7.764 14.307 8.105C14.542 8.446 14.456 8.913 14.114 9.148C12.53 10.238 11.054 11.585 10.958 12.032C11.054 12.417 12.53 13.764 14.114 14.853ZM12.25 2.25C5.051 2.25 2.5 4.802 2.5 12C2.5 19.199 5.051 21.75 12.25 21.75C19.448 21.75 22 19.199 22 12C22 4.802 19.448 2.25 12.25 2.25Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeftCircleCurvedBoldIcon;
