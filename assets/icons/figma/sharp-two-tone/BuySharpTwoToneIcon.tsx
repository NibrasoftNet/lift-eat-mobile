import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BuySharpTwoToneIcon component
 */
export const BuySharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M18.7761 20.0273C19.0661 20.0273 19.3012 20.2624 19.3012 20.5515C19.3012 20.8415 19.0661 21.0766 18.7761 21.0766C18.4861 21.0766 18.252 20.8415 18.252 20.5515C18.252 20.2624 18.4861 20.0273 18.7761 20.0273Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.90889 20.0273C8.19889 20.0273 8.43302 20.2624 8.43302 20.5515C8.43302 20.8415 8.19889 21.0766 7.90889 21.0766C7.61889 21.0766 7.38477 20.8415 7.38477 20.5515C7.38477 20.2624 7.61889 20.0273 7.90889 20.0273Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.625 10.9637H17.2967"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M5.87516 7.05288H21.5L20.2306 16.6875H6.74355L5.46652 3.99268H3"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default BuySharpTwoToneIcon;
