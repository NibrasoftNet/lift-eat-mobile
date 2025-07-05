import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp2CurvedLightOutlineIcon component
 */
export const ArrowUp2CurvedLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M4.24981 15.499C4.24981 15.369 4.28281 15.238 4.35381 15.118C4.80081 14.364 8.80882 7.75 11.9998 7.75C15.1898 7.75 19.1988 14.363 19.6458 15.118C19.8568 15.473 19.7388 15.935 19.3818 16.145C19.0248 16.356 18.5648 16.238 18.3538 15.882C16.8348 13.318 13.7668 9.25 11.9998 9.25C10.2298 9.25 7.16281 13.318 5.64581 15.882C5.43481 16.238 4.97481 16.356 4.61781 16.145C4.38181 16.005 4.24981 15.756 4.24981 15.499Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUp2CurvedLightOutlineIcon;
