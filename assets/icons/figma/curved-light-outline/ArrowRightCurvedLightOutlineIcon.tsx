import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightCurvedLightOutlineIcon component
 */
export const ArrowRightCurvedLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M13.8055 5.3162C13.6935 5.2542 13.5715 5.22619 13.4515 5.22619C13.1835 5.22619 12.9265 5.3692 12.7905 5.6202C12.5945 5.9852 12.7295 6.44019 13.0945 6.63619C14.9757 7.6512 17.8054 9.64286 18.56 11.2505L4.5 11.2505C4.086 11.2505 3.75 11.5865 3.75 12.0005C3.75 12.4145 4.086 12.7505 4.5 12.7505L18.5584 12.7505C17.8014 14.3596 14.9743 16.3501 13.0945 17.3652C12.7295 17.5622 12.5945 18.0162 12.7905 18.3812C12.9875 18.7452 13.4445 18.8802 13.8055 18.6852C14.4665 18.3302 20.2505 15.1212 20.2505 11.9982C20.2505 8.87919 14.4665 5.6712 13.8055 5.3162Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRightCurvedLightOutlineIcon;
