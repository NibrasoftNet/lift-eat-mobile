import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Filter3SharpLightBorderIcon component
 */
export const Filter3SharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M21.25 4.01074H3.25V7.71525L10 14.6017V21.1967L14.5 19.438V14.6017L21.25 7.71525V4.01074Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Filter3SharpLightBorderIcon;
