import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star4SharpBoldIcon component
 */
export const Star4SharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M21.6736 11.5315C17.5256 9.9975 14.2616 6.7335 12.7186 2.5765L12.2496 1.3125L11.7806 2.5765C10.2376 6.7335 6.97462 9.9975 2.82562 11.5315L1.55762 12.0005L2.82562 12.4685C6.97462 14.0025 10.2376 17.2665 11.7806 21.4245L12.2496 22.6875L12.7186 21.4245C14.2616 17.2665 17.5256 14.0025 21.6736 12.4685L22.9426 12.0005L21.6736 11.5315Z"
      fill={color}
    />
  </Svg>
);

export default Star4SharpBoldIcon;
