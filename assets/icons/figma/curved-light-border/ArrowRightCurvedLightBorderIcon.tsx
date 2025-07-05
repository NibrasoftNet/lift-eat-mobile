import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightCurvedLightBorderIcon component
 */
export const ArrowRightCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M13.6997 5.701C13.6997 5.701 19.7497 8.962 19.7497 11.724C19.7497 14.488 13.6997 17.75 13.6997 17.75"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.75 11.7256L4.75 11.7256"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowRightCurvedLightBorderIcon;
