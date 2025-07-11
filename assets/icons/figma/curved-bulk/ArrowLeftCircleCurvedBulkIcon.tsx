import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftCircleCurvedBulkIcon component
 */
export const ArrowLeftCircleCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 2.25C5.051 2.25 2.5 4.802 2.5 12C2.5 19.199 5.051 21.75 12.25 21.75C19.448 21.75 22 19.199 22 12C22 4.802 19.448 2.25 12.25 2.25Z"
      fill={color}
    />
    <Path
      d="M14.307 15.896C14.542 15.554 14.455 15.087 14.114 14.853C12.53 13.764 11.054 12.417 10.958 12.032C11.054 11.585 12.53 10.238 14.114 9.14798C14.456 8.91298 14.542 8.44598 14.307 8.10498C14.073 7.76398 13.608 7.67798 13.264 7.91198C11.843 8.88798 9.45996 10.718 9.45996 12.001C9.45996 13.285 11.843 15.114 13.264 16.089C13.394 16.178 13.542 16.221 13.688 16.221C13.927 16.221 14.162 16.108 14.307 15.896Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeftCircleCurvedBulkIcon;
