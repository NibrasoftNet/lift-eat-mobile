import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star5SharpLightBorderIcon component
 */
export const Star5SharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 2.75L14.3268 9.14159H21.0473L15.6103 13.0918L17.687 19.4834L12.25 15.5332L6.81299 19.4834L8.88974 13.0918L3.45273 9.14159H10.1732L12.25 2.75Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Star5SharpLightBorderIcon;
