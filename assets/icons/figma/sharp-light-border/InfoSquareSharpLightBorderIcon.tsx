import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * InfoSquareSharpLightBorderIcon component
 */
export const InfoSquareSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.2441 16.5347V12.5347"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2401 8.73877H12.2501"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.5 21.7847L21.5 3.28467L3 3.28467L3 21.7847L21.5 21.7847Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default InfoSquareSharpLightBorderIcon;
