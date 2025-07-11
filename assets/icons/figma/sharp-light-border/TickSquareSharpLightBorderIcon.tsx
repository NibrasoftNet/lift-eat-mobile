import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TickSquareSharpLightBorderIcon component
 */
export const TickSquareSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M8.62075 11.793C10.7098 13.1137 12.2707 15.4737 12.2707 15.4737H12.302C12.302 15.4737 15.618 9.60586 21.7786 5.99707"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.9712 21.7847C17.0798 21.7847 21.2212 17.6433 21.2212 12.5347C21.2212 7.42603 17.0798 3.28467 11.9712 3.28467C6.86256 3.28467 2.72119 7.42603 2.72119 12.5347C2.72119 17.6433 6.86256 21.7847 11.9712 21.7847Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default TickSquareSharpLightBorderIcon;
