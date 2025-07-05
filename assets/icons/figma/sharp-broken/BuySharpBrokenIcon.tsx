import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BuySharpBrokenIcon component
 */
export const BuySharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M18.775 20.0273C19.065 20.0273 19.3 20.2623 19.3 20.5513C19.3 20.8413 19.065 21.0763 18.775 21.0763C18.485 21.0763 18.251 20.8413 18.251 20.5513C18.251 20.2623 18.485 20.0273 18.775 20.0273Z"
      fill={color}
    />
    <Path
      d="M18.775 20.0273C19.065 20.0273 19.3 20.2623 19.3 20.5513C19.3 20.8413 19.065 21.0763 18.775 21.0763C18.485 21.0763 18.251 20.8413 18.251 20.5513C18.251 20.2623 18.485 20.0273 18.775 20.0273Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.90828 20.0273C8.19828 20.0273 8.43228 20.2623 8.43228 20.5513C8.43228 20.8413 8.19828 21.0763 7.90828 21.0763C7.61828 21.0763 7.38428 20.8413 7.38428 20.5513C7.38428 20.2623 7.61828 20.0273 7.90828 20.0273Z"
      fill={color}
    />
    <Path
      d="M7.90828 20.0273C8.19828 20.0273 8.43228 20.2623 8.43228 20.5513C8.43228 20.8413 8.19828 21.0763 7.90828 21.0763C7.61828 21.0763 7.38428 20.8413 7.38428 20.5513C7.38428 20.2623 7.61828 20.0273 7.90828 20.0273Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.624 10.9639H17.296"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.734 7.05316H21.5L20.231 16.6882H6.744L5.467 3.99316H3"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default BuySharpBrokenIcon;
