import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCircleCurvedBoldIcon component
 */
export const ArrowUpCircleCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M16.144 14.061C15.803 14.295 15.334 14.207 15.102 13.867C14.013 12.28 12.666 10.802 12.22 10.705C11.833 10.802 10.487 12.28 9.399 13.867C9.254 14.079 9.019 14.193 8.78 14.193C8.634 14.193 8.487 14.15 8.357 14.061C8.015 13.828 7.928 13.361 8.163 13.019C9.138 11.595 10.967 9.207 12.25 9.207C13.534 9.207 15.363 11.595 16.338 13.019C16.573 13.361 16.486 13.828 16.144 14.061ZM12.25 2.25C5.052 2.25 2.5 4.802 2.5 12C2.5 19.199 5.052 21.75 12.25 21.75C19.449 21.75 22 19.199 22 12C22 4.802 19.449 2.25 12.25 2.25Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpCircleCurvedBoldIcon;
