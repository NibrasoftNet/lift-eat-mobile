import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BuyRegularTwotoneIcon component
 */
export const BuyRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M18.6747 19.8203C19.0967 19.8203 19.4397 20.1633 19.4397 20.5853C19.4397 21.0073 19.0967 21.3493 18.6747 21.3493C18.2527 21.3493 17.9097 21.0073 17.9097 20.5853C17.9097 20.1633 18.2527 19.8203 18.6747 19.8203Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.4222 19.8203C7.8442 19.8203 8.1872 20.1633 8.1872 20.5853C8.1872 21.0073 7.8442 21.3493 7.4222 21.3493C7.0002 21.3493 6.6582 21.0073 6.6582 20.5853C6.6582 20.1633 7.0002 19.8203 7.4222 19.8203Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M2.75 3.25L4.83 3.61L5.793 15.083C5.871 16.018 6.652 16.736 7.59 16.736H18.502C19.398 16.736 20.158 16.078 20.287 15.19L21.236 8.632C21.353 7.823 20.726 7.099 19.909 7.099H5.164"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.1255 10.7949H16.8985"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default BuyRegularTwotoneIcon;
