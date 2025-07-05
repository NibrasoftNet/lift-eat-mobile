import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeDownSharpBoldIcon component
 */
export const VolumeDownSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M19.0927 7.62242L18.7197 6.97142L17.4187 7.71742L17.7907 8.36842C19.0767 10.6124 19.0767 13.3964 17.7917 15.6334L17.4177 16.2834L18.7177 17.0304L19.0927 16.3804C20.6417 13.6834 20.6417 10.3274 19.0927 7.62242Z"
      fill={color}
    />
    <Path
      d="M8.94037 7.56382H4.24737V8.06382C4.24437 10.6878 4.24437 13.3118 4.24737 15.9368V16.4358H8.94037L13.0664 20.0128H14.5284V3.98682H13.0664L8.94037 7.56382Z"
      fill={color}
    />
  </Svg>
);

export default VolumeDownSharpBoldIcon;
