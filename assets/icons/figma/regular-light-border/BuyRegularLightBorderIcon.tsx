import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BuyRegularLightBorderIcon component
 */
export const BuyRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M18.4346 20.2025C18.7356 20.2025 18.9796 20.4465 18.9796 20.7465C18.9796 21.0475 18.7356 21.2915 18.4346 21.2915C18.1336 21.2915 17.8906 21.0475 17.8906 20.7465C17.8906 20.4465 18.1336 20.2025 18.4346 20.2025Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.15435 20.2025C7.45535 20.2025 7.69835 20.4465 7.69835 20.7465C7.69835 21.0475 7.45535 21.2915 7.15435 21.2915C6.85335 21.2915 6.61035 21.0475 6.61035 20.7465C6.61035 20.4465 6.85335 20.2025 7.15435 20.2025Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M2.75 3.24988L4.83 3.60988L5.793 15.0829C5.87 16.0199 6.653 16.7389 7.593 16.7359H18.502C19.399 16.7379 20.16 16.0779 20.287 15.1899L21.236 8.63188C21.342 7.89888 20.833 7.21888 20.101 7.11288C20.037 7.10388 5.164 7.09888 5.164 7.09888"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.125 10.7948H16.898"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default BuyRegularLightBorderIcon;
