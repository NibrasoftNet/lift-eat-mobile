import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Image3SharpBulkIcon component
 */
export const Image3SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path d="M2.5 22.354H22V2.854H2.5V22.354Z" fill={color} />
    <Path
      d="M4.3679 20.803H20.2869L20.4929 20.411L14.9239 12.333L14.5139 12.33L10.6889 17.7L8.1979 15.616L7.8409 15.656L4.1709 20.4L4.3679 20.803Z"
      fill={color}
    />
    <Path
      d="M11.2029 9.17902C11.2019 7.90902 10.1669 6.87502 8.8959 6.87402C7.6259 6.87402 6.5919 7.90802 6.5919 9.17902C6.5919 10.451 7.6259 11.485 8.8959 11.485C10.1679 11.485 11.2029 10.451 11.2029 9.17902Z"
      fill={color}
    />
  </Svg>
);

export default Image3SharpBulkIcon;
