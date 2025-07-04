import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp2RegularLightOutlineIcon component
 */
export const ArrowUp2RegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M19.5303 16.0303C19.2641 16.2966 18.8474 16.3208 18.5538 16.1029L18.4697 16.0303L12 9.561L5.53033 16.0303C5.26406 16.2966 4.8474 16.3208 4.55379 16.1029L4.46967 16.0303C4.2034 15.7641 4.1792 15.3474 4.39705 15.0538L4.46967 14.9697L11.4697 7.96967C11.7359 7.7034 12.1526 7.6792 12.4462 7.89705L12.5303 7.96967L19.5303 14.9697C19.8232 15.2626 19.8232 15.7374 19.5303 16.0303Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUp2RegularLightOutlineIcon;
