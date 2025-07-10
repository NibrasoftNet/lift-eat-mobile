import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown3RegularLightBorderIcon component
 */
export const ArrowDown3RegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12.2515 12.6998V3.74976"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.25049 12.6997L12.2515 20.6367L17.2525 12.6997H7.25049Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowDown3RegularLightBorderIcon;
