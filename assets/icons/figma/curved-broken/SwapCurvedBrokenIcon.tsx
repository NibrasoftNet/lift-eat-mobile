import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SwapCurvedBrokenIcon component
 */
export const SwapCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.9629 19.4393V12.9463"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.0328 15.3398C21.0328 15.3398 18.8628 19.4398 16.9628 19.4398C15.0528 19.4398 12.8828 15.3398 12.8828 15.3398"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.04736 14.2275V17.1795"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.9629 9.77329V6.82129"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.04736 4.56152V11.0545"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.1173 8.66055C11.1173 8.66055 8.94729 4.56055 7.04729 4.56055C5.13729 4.56055 2.96729 8.66055 2.96729 8.66055"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default SwapCurvedBrokenIcon;
