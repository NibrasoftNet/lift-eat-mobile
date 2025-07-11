import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * WalletSharpTwoToneIcon component
 */
export const WalletSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M21.8803 16.7098H17.8061C16.3101 16.7089 15.0976 15.6059 15.0967 14.244C15.0967 12.8822 16.3101 11.7792 17.8061 11.7783H21.8803"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M2.61914 5.72607H21.8805V21.2501H2.61914V5.72607Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.2483 5.628V2.75074L2.61914 2.75V21.2495"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.18359 10.2936H12.6171"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default WalletSharpTwoToneIcon;
