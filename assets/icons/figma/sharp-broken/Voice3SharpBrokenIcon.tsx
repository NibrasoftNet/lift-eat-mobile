import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Voice3SharpBrokenIcon component
 */
export const Voice3SharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.248 22.104V19.333"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.708 11.0488H15.943"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.7881 7.43799H15.9401"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2487 15.702C10.2077 15.702 8.55371 14.041 8.55371 11.991V6.817C8.55371 4.767 10.2077 3.104 12.2487 3.104C14.2907 3.104 15.9447 4.767 15.9447 6.817V11.991C15.9447 14.041 14.2907 15.702 12.2487 15.702Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.5277 12.02C19.5277 16.059 16.2697 19.333 12.2487 19.333C8.22968 19.333 4.97168 16.059 4.97168 12.02"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Voice3SharpBrokenIcon;
