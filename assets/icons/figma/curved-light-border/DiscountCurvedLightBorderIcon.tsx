import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DiscountCurvedLightBorderIcon component
 */
export const DiscountCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2.75 12C2.75 5.063 5.063 2.75 12 2.75C18.937 2.75 21.25 5.063 21.25 12C21.25 18.937 18.937 21.25 12 21.25C5.063 21.25 2.75 18.937 2.75 12Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.42969 14.5697L14.5697 9.42969"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.4955 14.5H14.5045"
      fill={none}
      stroke={color}
      strokeWidth="2"
    />
    <Path d="M9.4955 9.5H9.5045" fill={none} stroke={color} strokeWidth="2" />
  </Svg>
);

export default DiscountCurvedLightBorderIcon;
