import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ImageSharpLightBorderIcon component
 */
export const ImageSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M6.05762 18.8144H18.7411L18.7657 18.7821L14.8759 12.2573H14.7804L11.7655 16.2582L8.42777 14.5738H8.31122L6.03809 18.7822L6.05762 18.8144Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.678 8.71595C10.678 9.77696 9.81847 10.6365 8.75746 10.6365C7.69645 10.6365 6.83691 9.77696 6.83691 8.71595C6.83691 7.65495 7.69645 6.79541 8.75746 6.79541C9.81847 6.79651 10.678 7.65495 10.678 8.71595Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.5 21.854L21.5 3.354L3 3.354L3 21.854L21.5 21.854Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ImageSharpLightBorderIcon;
