import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star7SharpBoldIcon component
 */
export const Star7SharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M22.7715 12L17.5955 9.78596L19.6885 4.55996L14.4675 6.65396L12.2505 1.48096L10.0325 6.65396L4.81152 4.55996L6.90452 9.78596L1.72852 12L6.90452 14.214L4.81152 19.44L10.0325 17.346L12.2505 22.519L14.4675 17.346L19.6885 19.44L17.5955 14.214L22.7715 12Z"
      fill={color}
    />
  </Svg>
);

export default Star7SharpBoldIcon;
