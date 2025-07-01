import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeDownSharpBulkIcon component
 */
export const VolumeDownSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M19.093 7.62268L18.72 6.97168L17.419 7.71768L17.791 8.36868C19.077 10.6127 19.077 13.3967 17.792 15.6337L17.418 16.2837L18.718 17.0307L19.093 16.3807C20.642 13.6837 20.642 10.3277 19.093 7.62268Z" fill={color} />
    <Path d="M8.94037 7.5643H4.24737V8.0643C4.24437 10.6883 4.24437 13.3123 4.24737 15.9373V16.4363H8.94037L13.0664 20.0133H14.5284V3.9873H13.0664L8.94037 7.5643Z" fill={color} />
  </Svg>
);

export default VolumeDownSharpBulkIcon;
