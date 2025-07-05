import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Bag3SharpBoldIcon component
 */
export const Bag3SharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M8.98001 6.78395C8.99001 4.99395 10.45 3.54395 12.24 3.54395C14.09 3.53395 15.52 4.99395 15.52 6.80395V7.04395H17.02V6.80395C17.02 4.17395 14.88 2.04395 12.26 2.04395H12.24C9.63001 2.04395 7.49001 4.16395 7.48001 6.80395V7.04395H8.98001V6.78395Z"
      fill={color}
    />
    <Path
      d="M17.02 7.04395L17.02 10.7739H15.52L15.52 7.04395H8.98001L8.98 10.7739H7.48L7.48001 7.04395H2.5V12.4839C2.5 17.8639 6.87 22.2339 12.25 22.2339C17.63 22.2339 22 17.8639 22 12.4839V7.04395H17.02Z"
      fill={color}
    />
  </Svg>
);

export default Bag3SharpBoldIcon;
