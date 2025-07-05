import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Setting2SharpBoldIcon component
 */
export const Setting2SharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.2509 15.2385C10.5419 15.2385 9.15085 13.8475 9.15085 12.1385C9.15085 10.4295 10.5419 9.03852 12.2509 9.03852C13.9599 9.03852 15.3509 10.4295 15.3509 12.1385C15.3509 13.8475 13.9599 15.2385 12.2509 15.2385ZM17.5389 2.97852H6.96085L1.67285 12.1385L6.96085 21.2985H17.5389L22.8269 12.1385L17.5389 2.97852Z"
      fill={color}
    />
  </Svg>
);

export default Setting2SharpBoldIcon;
