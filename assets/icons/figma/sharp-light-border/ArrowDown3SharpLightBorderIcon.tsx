import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown3SharpLightBorderIcon component
 */
export const ArrowDown3SharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2495 19.9995L12.2495 3.99975"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.58946 14.3398C9.49921 14.3398 12.2495 16.9024 12.2495 19.9999"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.9096 14.3398C14.9998 14.3398 12.2495 16.9024 12.2495 19.9999"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowDown3SharpLightBorderIcon;
