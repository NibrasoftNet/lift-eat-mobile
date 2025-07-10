import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightRegularLightBorderIcon component
 */
export const ArrowRightRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M19.75 11.7256L4.75 11.7256"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.7002 5.70124L19.7502 11.7252L13.7002 17.7502"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowRightRegularLightBorderIcon;
