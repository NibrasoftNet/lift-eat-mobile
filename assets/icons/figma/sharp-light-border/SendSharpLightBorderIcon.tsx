import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SendSharpLightBorderIcon component
 */
export const SendSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M21.5484 2.7019L16.0586 21.298H16.0336L10.7935 13.4567L2.95215 8.21654V8.1875L21.5156 2.66797L21.5484 2.7019Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.0396 13.2685L15.4819 8.82617"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default SendSharpLightBorderIcon;
