import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeOffSharpBoldIcon component
 */
export const VolumeOffSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M7.57709 7.5633H2.88409V8.0633C2.88109 10.6883 2.88109 13.3123 2.88409 15.9373V16.4363H7.57709L11.7031 20.0123H13.1651V3.9873H11.7031L7.57709 7.5633Z"
      fill={color}
    />
    <Path
      d="M21.6181 10.2669L20.5571 9.2059L18.8241 10.9399L17.0911 9.2059L16.0301 10.2669L17.7641 12.0009L16.0311 13.7329L17.0921 14.7939L18.8241 13.0609L20.5561 14.7939L21.6171 13.7329L19.8851 12.0009L21.6181 10.2669Z"
      fill={color}
    />
  </Svg>
);

export default VolumeOffSharpBoldIcon;
