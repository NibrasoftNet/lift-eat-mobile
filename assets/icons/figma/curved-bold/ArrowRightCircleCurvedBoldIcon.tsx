import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightCircleCurvedBoldIcon component
 */
export const ArrowRightCircleCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M11.235 16.089C11.105 16.178 10.958 16.221 10.811 16.221C10.572 16.221 10.338 16.108 10.192 15.896C9.958 15.555 10.044 15.088 10.385 14.853C11.969 13.763 13.445 12.415 13.542 11.969C13.445 11.583 11.969 10.236 10.385 9.148C10.045 8.913 9.958 8.446 10.192 8.105C10.426 7.763 10.892 7.677 11.235 7.911C12.656 8.887 15.04 10.716 15.04 11.999C15.04 13.282 12.656 15.112 11.235 16.089ZM12.25 2.25C5.051 2.25 2.5 4.802 2.5 12C2.5 19.198 5.051 21.75 12.25 21.75C19.448 21.75 22 19.198 22 12C22 4.802 19.448 2.25 12.25 2.25Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRightCircleCurvedBoldIcon;
