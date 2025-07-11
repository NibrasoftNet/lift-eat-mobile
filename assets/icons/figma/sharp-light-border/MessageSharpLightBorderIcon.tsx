import * as React from 'react';
import Svg, { SvgProps, Path, Rect } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MessageSharpLightBorderIcon component
 */
export const MessageSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M18.0537 9.38574L12.2895 14.0697L6.52539 9.38574"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Rect
      x="2.25"
      y="3.53467"
      width="20"
      height="18"
      fill='none'
      stroke={color}
    />
  </Svg>
);

export default MessageSharpLightBorderIcon;
