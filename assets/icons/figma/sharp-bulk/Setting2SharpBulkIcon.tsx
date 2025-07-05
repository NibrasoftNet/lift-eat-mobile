import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Setting2SharpBulkIcon component
 */
export const Setting2SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M17.5389 2.97852H6.96085L1.67285 12.1385L6.96085 21.2985H17.5389L22.8269 12.1385L17.5389 2.97852Z"
      fill={color}
    />
    <Path
      d="M9.15088 12.1386C9.15088 13.8476 10.5419 15.2386 12.2509 15.2386C13.9599 15.2386 15.3509 13.8476 15.3509 12.1386C15.3509 10.4296 13.9599 9.03857 12.2509 9.03857C10.5419 9.03857 9.15088 10.4296 9.15088 12.1386Z"
      fill={color}
    />
  </Svg>
);

export default Setting2SharpBulkIcon;
