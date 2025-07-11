import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ImageSharpBrokenIcon component
 */
export const ImageSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M18.7661 18.7818L14.8761 12.2568H14.7801L11.7661 16.2578L8.42809 14.5738H8.31109L6.03809 18.7818L6.05809 18.8138H15.7041"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.75691 6.7959C9.81791 6.7969 10.6779 7.6549 10.6779 8.7159C10.6779 9.7769 9.81791 10.6369 8.75691 10.6369C7.69591 10.6369 6.83691 9.7769 6.83691 8.7159"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.5 7.478V3.354H3V21.854H21.5V11.329"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ImageSharpBrokenIcon;
