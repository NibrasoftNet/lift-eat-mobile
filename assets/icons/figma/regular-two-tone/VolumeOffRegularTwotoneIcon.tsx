import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeOffRegularTwotoneIcon component
 */
export const VolumeOffRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M6.09491 16.6499C5.85991 16.5769 5.64691 16.4689 5.45991 16.3089C4.69491 15.6559 4.75091 13.9119 4.75091 12.6329C4.75091 11.3549 4.69491 9.60995 5.45991 8.95795C6.16891 8.35095 6.67291 8.50995 7.96991 8.40695C9.26591 8.30395 12.0089 4.34895 14.1259 5.59895C14.6109 5.99295 14.8959 6.58095 15.0639 7.48595"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.2832 14.6675C15.2462 17.5405 15.0212 18.9395 14.1262 19.6675C13.1462 20.2465 12.0362 19.7145 10.9912 18.9585"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M4.75195 20.7495L8.46495 17.0365L15.284 10.2165L20.751 4.74951"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default VolumeOffRegularTwotoneIcon;
