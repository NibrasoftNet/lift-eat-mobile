import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSquareRegularLightBorderIcon component
 */
export const ArrowLeftSquareRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2.75 7.66588L2.75 16.3349C2.75 19.3549 4.889 21.2499 7.916 21.2499L16.084 21.2499C19.111 21.2499 21.25 19.3649 21.25 16.3349L21.25 7.66588C21.25 4.63588 19.111 2.74988 16.084 2.74988L7.916 2.74988C4.889 2.74988 2.75 4.63588 2.75 7.66588Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.91394 11.9999L16.0859 11.9999"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.6777 15.7478L7.91373 11.9998L11.6777 8.25183"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowLeftSquareRegularLightBorderIcon;
