import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShieldFailCurvedLightBorderIcon component
 */
export const ShieldFailCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.9851 21.606C14.3191 21.606 19.6571 19.284 19.6571 12.879C19.6571 6.47498 19.9351 5.97398 19.3191 5.35798C18.7031 4.74198 15.4941 2.75098 11.9851 2.75098C8.47608 2.75098 5.26608 4.74198 4.65008 5.35798C4.03408 5.97398 4.31208 6.47498 4.31208 12.879C4.31208 19.284 9.65008 21.606 11.9851 21.606Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.864 13.8244L10.105 10.0664"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.105 13.8244L13.864 10.0664"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ShieldFailCurvedLightBorderIcon;
