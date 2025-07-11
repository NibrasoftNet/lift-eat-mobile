import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EditSquareSharpBrokenIcon component
 */
export const EditSquareSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M8.18653 12.8861L13.1825 7.89014L16.9825 11.6911L6.81953 21.8541L3.02253 21.8511L3.01953 18.0531L5.79753 15.2751"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2636 12.6166L10.5176 10.8706"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.4803 7.75977V21.8538H12.9443"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M3.01953 12.0505V3.35352H21.4805"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default EditSquareSharpBrokenIcon;
