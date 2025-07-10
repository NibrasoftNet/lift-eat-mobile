import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star7SharpLightBorderIcon component
 */
export const Star7SharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 2.75L14.1969 7.29976L18.7907 5.45926L16.9502 10.0531L21.5 12L16.9502 13.9469L18.7907 18.5407L14.1969 16.7002L12.25 21.25L10.3031 16.7002L5.70926 18.5407L7.54976 13.9469L3 12L7.54976 10.0531L5.70926 5.45926L10.3031 7.29976L12.25 2.75Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Star7SharpLightBorderIcon;
