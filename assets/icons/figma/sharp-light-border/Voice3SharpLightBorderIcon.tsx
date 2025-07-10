import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Voice3SharpLightBorderIcon component
 */
export const Voice3SharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.248 22.1039V19.3325"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.708 11.0489H15.9428"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.7881 7.43804H15.9405"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2482 15.7023C10.2075 15.7023 8.55273 14.0408 8.55273 11.9906V6.81664C8.55273 4.76641 10.2075 3.104 12.2482 3.104C14.2899 3.104 15.9437 4.76641 15.9437 6.81664V11.9906C15.9437 14.0408 14.2899 15.7023 12.2482 15.7023Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.5277 12.02C19.5277 16.0582 16.2697 19.3323 12.2492 19.3323C8.22965 19.3323 4.97168 16.0582 4.97168 12.02"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Voice3SharpLightBorderIcon;
